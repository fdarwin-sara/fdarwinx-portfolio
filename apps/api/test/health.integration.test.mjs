import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../dist/app.js";
import { readEnvironment } from "../dist/config/environment.js";

const config = readEnvironment({});
const allowedOrigin = "http://localhost:3000";
const deniedOrigin = "https://unlisted.example.test";

async function startApi(t) {
  const app = await createApp(config);
  t.after(() => app.close());
  await app.listen(0, "127.0.0.1");
  return await app.getUrl();
}

test("Health reports availability and sends security headers", async (t) => {
  const url = await startApi(t);
  const response = await fetch(url + "/api/health");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("CORS grants the configured origin and denies other origins", async (t) => {
  const url = (await startApi(t)) + "/api/health";
  for (const origin of [allowedOrigin, deniedOrigin]) {
    const expectedOrigin = origin === allowedOrigin ? origin : null;
    const request = await fetch(url, { headers: { Origin: origin } });
    assert.equal(request.headers.get("access-control-allow-origin"), expectedOrigin);
    assert.equal(request.headers.get("access-control-allow-credentials"), null);
    const preflight = await fetch(url, {
      method: "OPTIONS",
      headers: { Origin: origin, "Access-Control-Request-Method": "GET" },
    });
    assert.equal(preflight.headers.get("access-control-allow-origin"), expectedOrigin);
    if (expectedOrigin) assert.equal(preflight.status, 204);
  }
});

test("reserved endpoints return sanitized not-found responses", async (t) => {
  const url = await startApi(t);
  assert.equal((await fetch(url + "/health")).status, 404);
  for (const [method, path] of [
    ["GET", "/api/github/activity"],
    ["GET", "/api/astronomy/apod"],
    ["POST", "/api/contact"],
  ]) {
    const response = await fetch(url + path, { method });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { statusCode: 404, message: "Not Found" });
  }
});

test("JSON parser rejects invalid and oversized requests without reflecting content", async (t) => {
  const url = (await startApi(t)) + "/api/health";
  for (const [body, code, message] of [
    ["{invalid payload", 400, "Bad Request"],
    [JSON.stringify({ sample: "x".repeat(17_000) }), 413, "Payload Too Large"],
  ]) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    assert.equal(response.status, code);
    assert.deepEqual(await response.json(), { statusCode: code, message });
  }
});

test("rate limit ignores an untrusted forwarding header", async (t) => {
  const url = (await startApi(t)) + "/api/health";
  for (let index = 0; index < 61; index++) {
    const response = await fetch(url, { headers: { "X-Forwarded-For": `192.0.2.${index + 1}` } });
    assert.equal(response.status, index < 60 ? 200 : 429);
    if (index < 60) {
      await response.arrayBuffer();
    } else {
      assert.ok(Number(response.headers.get("retry-after")) > 0);
      assert.deepEqual(await response.json(), { statusCode: 429, message: "Too Many Requests" });
    }
  }
});
