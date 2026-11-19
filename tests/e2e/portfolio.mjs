import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const origin = process.env.PREVIEW_URL ?? "http://localhost:3000";
const output = "test-results/phase-3";
const sizes = [[1920,1080],[1440,900],[1366,768],[768,1024],[390,844],[375,812]];
const projects = [
  ["austral-group", "Austral Group"],
  ["gastosmart", "GastoSmart"],
  ["rincon-de-coco", "El Rincón de Coco"],
];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = { origin, browser: browser.version(), sizes: [], projects: [], interactions: {} };
const problems = { console: [], pageErrors: [], failedRequests: [], httpErrors: [] };
const checks = [];

async function open(options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const log = { console: [], pageErrors: [], failedRequests: [], httpErrors: [] };
  page.on("console", message => {
    if (["error", "warning"].includes(message.type())) log.console.push(message.text());
  });
  page.on("pageerror", error => log.pageErrors.push(error.message));
  page.on("requestfailed", request => log.failedRequests.push([request.url(), request.failure()?.errorText]));
  page.on("response", response => {
    if (response.status() >= 400) log.httpErrors.push([response.status(), response.url()]);
  });
  return { context, page, log };
}

async function load(page) {
  const response = await page.goto(origin, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  return response.status();
}

function collect(label, log) {
  for (const key of Object.keys(log)) problems[key].push(...log[key].map(message => ({ label, message })));
}

try {
  for (const [width, height] of sizes) {
    const label = width + "x" + height;
    const { context, page, log } = await open({
      viewport: { width, height }, hasTouch: width <= 768, isMobile: width <= 768,
    });
    const status = await load(page);
    await page.getByRole("button", { name: "Send a pulse through Gravity" }).waitFor();
    const result = await page.evaluate(() => {
      const selectors = [".wordmark", ".nav-links a", ".eyebrow", "h1", ".hero-description", ".work-link", ".scroll-cue", ".figure-label", ".portfolio-row h2", ".portfolio-row p", ".site-footer"];
      const color = rgb => rgb.match(/[\d.]+/g).slice(0, 3).map(Number);
      const luminance = values => values.map(value => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
      const body = color(getComputedStyle(document.body).backgroundColor);
      const colors = Object.fromEntries(selectors.map(selector => {
        const style = getComputedStyle(document.querySelector(selector));
        const bg = style.backgroundColor === "rgba(0, 0, 0, 0)" ? body : color(style.backgroundColor);
        const alpha = Number(style.opacity);
        const fg = color(style.color).map((value, index) => value * alpha + bg[index] * (1 - alpha));
        const levels = [luminance(fg), luminance(bg)].sort((a,b) => b-a);
        return [selector, { size: style.fontSize, ratio: +((levels[0] + .05) / (levels[1] + .05)).toFixed(2) }];
      }));
      const gravity = document.querySelector(".gravity").getBoundingClientRect();
      const title = document.querySelector("h1");
      const titleRange = document.createRange();
      titleRange.selectNodeContents(title);
      const titleRects = [...titleRange.getClientRects()];
      return {
        viewport: [innerWidth, innerHeight],
        scrollWidth: document.documentElement.scrollWidth,
        heroTitle: title.textContent, font: getComputedStyle(title).fontFamily,
        gravityCSSSize: Math.round(gravity.width),
        titleRight: Math.round(Math.max(...titleRects.map(rect => rect.right))),
        gravityLeft: Math.round(gravity.left),
        heroFooterBottom: Math.round(document.querySelector(".hero-footer").getBoundingClientRect().bottom),
        colors,
      };
    });
    await page.screenshot({ path: output + "/" + label + ".png" });
    if (width === 390 || width === 1440) {
      await page.locator("#work").screenshot({ path: output + "/work-" + label + ".png" });
    }
    const navigation = [];
    for (const [label, id] of [["Work","work"],["About","about"],["Contact","contact"],["Home","home"]]) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.getByRole("navigation").getByRole("link", { name: label, exact: true }).click();
      await page.waitForFunction(id => location.hash === "#" + id, id);
      const destinationVisible = await page.waitForFunction(id => {
        const r = document.getElementById(id).getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && (id !== "home" || scrollY <= 2);
      }, id, { timeout: 3000 }).then(() => true, () => false);
      navigation.push({ id, destinationVisible });
    }
    await page.getByRole("link", { name: "Explore work" }).click();
    await page.waitForFunction(() => location.hash === "#work");
    report.sizes.push({ label, status, ...result, exploreWork: true, navigation });
    checks.push(
      [status === 200 && result.heroTitle === "Just me.", label + " renders the Hero"],
      [result.viewport[0] === width && result.viewport[1] === height && result.scrollWidth === width, label + " has no horizontal overflow"],
      [navigation.every(({ destinationVisible }) => destinationVisible), label + " navigation destinations are visible"],
      [Object.values(result.colors).every(({ ratio }) => ratio >= 4.5), label + " sampled text passes contrast"],
      [width !== 375 || result.heroFooterBottom <= height, label + " Hero footer fits"],
    );
    collect(label, log);
    await context.close();
  }

  for (const width of [1440, 390]) {
    const { context, page, log } = await open({ viewport: { width, height: width === 390 ? 844 : 900 } });
    for (const [slug, name] of projects) {
      await load(page);
      await page.locator("#work").getByRole("link", { name, exact: true }).click();
      await page.waitForURL("**/work/" + slug);
      await page.getByRole("heading", { name, exact: true, level: 1 }).waitFor();
      const detail = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        canonical: document.querySelector("link[rel=canonical]")?.getAttribute("href"),
        sections: [...document.querySelectorAll("article h2")].map(heading => heading.textContent),
      }));
      const github = await page.getByRole("link", { name: "GitHub repository" }).getAttribute("href", { timeout: 1000 }).catch(() => null);
      checks.push(
        [detail.scrollWidth === width, slug + " has no overflow at " + width],
        [detail.canonical === "https://fdarwinx.me/work/" + slug, slug + " has a canonical URL"],
        [detail.sections.join("|") === "Features|Architecture|Development status", slug + " has the case study sections"],
        [github === (slug === "gastosmart" ? "https://github.com/fdarwin-sara/gastosmart" : null), slug + " has only verified repository links"],
      );
      report.projects.push({ slug, width, github, ...detail });
      await page.screenshot({ path: output + "/" + slug + "-" + width + ".png", fullPage: true });
      await page.getByRole("link", { name: "Back to work" }).click();
      await page.waitForURL("**/#work");
      await page.getByRole("heading", { name: "Work", exact: true, level: 2 }).waitFor();
      await page.waitForLoadState("networkidle");
    }
    const missing = await context.request.get(origin + "/work/missing-project");
    checks.push([missing.status() === 404, "Unknown work route returns 404"]);
    const icon = await context.request.get(origin + "/icon.svg");
    checks.push([icon.status() === 200, "Favicon can be loaded"]);
    collect("projects/" + width, log);
    await context.close();
  }

  const keyboard = await open({ viewport: { width: 1440, height: 900 } });
  await load(keyboard.page);
  await keyboard.page.getByRole("button", { name: "Send a pulse through Gravity" }).waitFor();
  report.interactions.keyboard = [];
  for (let index = 0; index < 9; index++) {
    await keyboard.page.keyboard.press("Tab");
    report.interactions.keyboard.push(await keyboard.page.evaluate(() => {
      const element = document.activeElement;
      const css = getComputedStyle(element);
      return {
        label: element.getAttribute("aria-label") || element.textContent.trim(),
        focusVisible: element.matches(":focus-visible"), outline: css.outlineStyle + " " + css.outlineWidth,
      };
    }));
  }
  await keyboard.page.keyboard.press("Enter");
  await keyboard.page.waitForFunction(() => location.hash === "#work");
  report.interactions.keyboardDestination = new URL(keyboard.page.url()).hash;
  checks.push(
    [report.interactions.keyboard.every(({ focusVisible, outline }) => focusVisible && outline === "solid 2px"), "Keyboard controls show visible focus"],
    [report.interactions.keyboard.map(({ label }) => label).join("|") === "Skip to content|fdarwinx home|Home|Work|About|Contact|Explore work|Send a pulse through Gravity|Scroll to work", "Keyboard order"],
  );
  collect("keyboard", keyboard.log);
  await keyboard.context.close();

  async function gravitySample(action, mobile) {
    const session = await open(mobile
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }
      : { viewport: { width: 1440, height: 900 } });
    const { page } = session;
    const origin = new Date("2026-11-18T12:00:00Z");
    await page.clock.install({ time: origin });
    await page.clock.pauseAt(new Date(origin.getTime() + 1000));
    await load(page);
    await page.clock.runFor(160);
    const bounds = await page.locator(".gravity-input").boundingBox();
    const x = bounds.x + bounds.width * .68;
    const y = bounds.y + bounds.height * .39;
    if (action === "hover" || action === "click") await page.mouse.move(x, y);
    if (action === "click") await page.mouse.click(x, y);
    if (action === "tap") await page.touchscreen.tap(x, y);
    if (action === "keyboard") {
      await page.locator(".gravity-input").focus();
      await page.keyboard.press("Space");
    }
    await page.clock.runFor(240);
    const sample = await page.locator("canvas").evaluate(canvas => {
      const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      let hash = 2166136261, filled = 0;
      for (let index = 3; index < pixels.length; index += 4) {
        hash = Math.imul(hash ^ pixels[index], 16777619);
        if (pixels[index]) filled++;
      }
      return { hash: hash >>> 0, filled };
    });
    collect("gravity/" + action, session.log);
    await session.context.close();
    return sample;
  }

  const gravity = {};
  for (const action of ["idle", "hover", "click", "keyboard"]) gravity[action] = await gravitySample(action, false);
  gravity.repeatIdle = await gravitySample("idle", false);
  gravity.mobileIdle = await gravitySample("idle", true);
  gravity.tap = await gravitySample("tap", true);
  report.interactions.gravity = {
    ...gravity, baselineReproduced: gravity.idle.hash === gravity.repeatIdle.hash,
    cursorChangesFrame: gravity.idle.hash !== gravity.hover.hash,
    clickChangesHoveredFrame: gravity.hover.hash !== gravity.click.hash,
    keyboardChangesFrame: gravity.idle.hash !== gravity.keyboard.hash,
    tapChangesMobileFrame: gravity.mobileIdle.hash !== gravity.tap.hash,
  };
  checks.push([Object.values(report.interactions.gravity).filter(value => typeof value === "boolean").every(Boolean), "Gravity responds to pointer, click, touch, and keyboard"]);

  for (const mode of ["reduced", "no-js"]) {
    const session = await open({ viewport: { width: 390, height: 844 },
      ...(mode === "reduced" ? { reducedMotion: "reduce" } : { javaScriptEnabled: false }) });
    await load(session.page);
    report.interactions[mode] = await session.page.evaluate(() => ({
      canvas: getComputedStyle(document.querySelector("canvas")).display,
      control: getComputedStyle(document.querySelector(".gravity-input")).display,
      fallback: getComputedStyle(document.querySelector(".gravity")).backgroundImage,
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
    }));
    const state = report.interactions[mode];
    checks.push(
      [state.control === "none", mode + " hides the Gravity control"],
      [state.fallback.includes("/gravity.svg"), mode + " keeps the SVG fallback"],
    );
    await session.page.screenshot({ path: output + "/390x844-" + mode + ".png" });
    if (mode === "reduced") {
      checks.push([state.canvas === "none" && state.scroll === "auto", "Reduced motion disables Canvas and smooth scrolling"]);
    } else {
      const projectLink = session.page.getByRole("link", { name: "GastoSmart", exact: true });
      await projectLink.click();
      await session.page.waitForURL("**/work/gastosmart");
      await session.page.getByRole("heading", { name: "GastoSmart", level: 1 }).waitFor();
    }
    collect(mode, session.log);
    await session.context.close();
  }
  const unexpectedWarnings = problems.console.filter(({ label, message }) =>
    !(label === "reduced" && message.startsWith("You have Reduced Motion enabled")));
  const unexpectedRequests = problems.failedRequests.filter(({ label, message: [url, reason] }) =>
    !(label === "no-js" && reason === "csp" && new URL(url).pathname.startsWith("/_next/static/")));
  checks.push(
    [unexpectedWarnings.length === 0 && problems.pageErrors.length === 0, "No console, runtime, or hydration errors"],
    [unexpectedRequests.length === 0 && problems.httpErrors.length === 0, "No unexpected request failures"],
  );
  const failures = checks.filter(([passed]) => !passed).map(([, name]) => name);
  assert.deepEqual(failures, []);
  console.log(`Passed ${checks.length} checks. Screenshots and report: ${output}`);
} finally {
  report.problems = problems;
  report.checks = checks.map(([passed, name]) => ({ name, passed }));
  await writeFile(output + "/audit.json", JSON.stringify(report, null, 2));
  await browser.close();
}
