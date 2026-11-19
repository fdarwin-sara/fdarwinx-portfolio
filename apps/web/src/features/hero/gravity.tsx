"use client";

import { useEffect, useRef } from "react";

const size = 700;
const tilt = -Math.PI * 31 / 180;
const trackRadii = [147, 181, 209, 237, 268, 290];

type Point = { x: number; y: number };
type Pulse = Point & { started: number };

function randomSequence() {
  let seed = 2879;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function Gravity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlRef = useRef<HTMLButtonElement>(null);
  const pointer = useRef<Point | null>(null);
  const pulse = useRef<Pulse | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const control = controlRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !control) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const random = randomSequence();
    const particles = Array.from({ length: 1550 }, (_, index) => {
      const track = trackRadii[index % trackRadii.length];
      return {
        radius: track + (random() - 0.5) * 31,
        angle: random() * Math.PI * 2,
        speed: (0.10 + random() * 0.12) * (180 / track),
        light: 0.12 + random() * 0.72,
        size: random() > 0.96 ? 1.75 : 0.45 + random() * 0.6,
      };
    });

    let frame = 0;
    let elapsed = 0;
    let previousTime = 0;
    let visible = true;
    let count = particles.length;
    const field = { x: size / 2, y: size / 2, strength: 0 };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };

    const render = (now: number) => {
      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 0;
      previousTime = now;
      elapsed += delta;
      context.clearRect(0, 0, size, size);

      const cursor = pointer.current;
      if (cursor) {
        field.x += (cursor.x - field.x) * Math.min(delta * 12, 1);
        field.y += (cursor.y - field.y) * Math.min(delta * 12, 1);
      }
      field.strength += ((cursor ? 1 : 0) - field.strength) * Math.min(delta * 7, 1);

      const wave = pulse.current;
      const age = wave ? (now - wave.started) / 1000 : 2;
      if (wave && age > 1.2) pulse.current = null;
      const waveRadius = age * 360;
      const cos = Math.cos(tilt);
      const sin = Math.sin(tilt);
      context.fillStyle = "#f5f5f5";
      for (let index = 0; index < count; index++) {
        const particle = particles[index];
        const angle = particle.angle + elapsed * particle.speed;
        const u = Math.cos(angle) * particle.radius;
        const v = Math.sin(angle) * (particle.radius * 0.55 - 34);
        let x = 350 + u * cos - v * sin;
        let y = 350 + u * sin + v * cos;

        const dx = field.x - x;
        const dy = field.y - y;
        const influence = Math.max(0, 1 - (dx * dx + dy * dy) / 22500);
        x += dx * influence * field.strength * 0.36;
        y += dy * influence * field.strength * 0.36;

        let surge = 0;
        if (wave && age <= 1.2) {
          const wx = x - wave.x;
          const wy = y - wave.y;
          const distance = Math.hypot(wx, wy);
          surge = Math.max(0, 1 - Math.abs(distance - waveRadius) / 44) * (1 - age / 1.2);
          x += wx / Math.max(1, distance) * surge * 36;
          y += wy / Math.max(1, distance) * surge * 36;
        }

        if (v < 0 && (x - 350) ** 2 + (y - 350) ** 2 < 79 ** 2) continue;
        context.globalAlpha = Math.min(1, particle.light + surge * 0.48);
        context.fillRect(x, y, particle.size, particle.size);
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(render);
    };

    const sync = () => {
      if (reduced.matches || document.hidden || !visible) {
        stop();
        if (reduced.matches) context.clearRect(0, 0, size, size);
      } else if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };

    const resize = new ResizeObserver(() => {
      const width = canvas.clientWidth;
      const pixels = Math.max(1, Math.round(width * Math.min(window.devicePixelRatio, 1.75)));
      canvas.width = pixels;
      canvas.height = pixels;
      context.setTransform(pixels / size, 0, 0, pixels / size, 0, 0);
      count = width < 470 ? 740 : particles.length;
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });

    resize.observe(canvas);
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    control.hidden = false;
    sync();
    return () => {
      control.hidden = true;
      stop();
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  function locate(event: React.MouseEvent<HTMLButtonElement>): Point {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * size / bounds.width,
      y: (event.clientY - bounds.top) * size / bounds.height,
    };
  }

  return (
    <div className="gravity">
      <canvas ref={canvasRef} className="gravity-canvas" aria-hidden="true" />
      <button
        ref={controlRef}
        hidden
        type="button"
        className="gravity-input"
        aria-label="Send a pulse through Gravity"
        onPointerMove={(event) => { pointer.current = locate(event); }}
        onPointerLeave={() => { pointer.current = null; }}
        onPointerCancel={() => { pointer.current = null; }}
        onPointerUp={(event) => { if (event.pointerType !== "mouse") pointer.current = null; }}
        onClick={(event) => {
          const origin = event.detail === 0 ? { x: size / 2, y: size / 2 } : locate(event);
          pulse.current = { ...origin, started: performance.now() };
        }}
      />
    </div>
  );
}
