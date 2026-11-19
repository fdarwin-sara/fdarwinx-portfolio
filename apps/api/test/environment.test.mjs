import assert from "node:assert/strict";
import { test } from "node:test";
import { readEnvironment } from "../dist/config/environment.js";

test("uses local defaults without integration variables", () => {
  assert.deepEqual(readEnvironment({}), {
    port: 4000,
    corsOrigins: ["http://localhost:3000"],
  });
});

test("accepts a custom port and exact, deduplicated origins", () => {
  assert.deepEqual(readEnvironment({
    PORT: "4500",
    CORS_ORIGINS: "https://fdarwinx.me, http://localhost:3005, https://fdarwinx.me",
  }), {
    port: 4500,
    corsOrigins: ["https://fdarwinx.me", "http://localhost:3005"],
  });
});

test("rejects malformed ports without echoing their values", () => {
  for (const PORT of ["0", "65536", "4000.5", "1e3", "invalid-input", ""]) {
    assert.throws(() => readEnvironment({ PORT }), {
      message: "PORT must be an integer between 1 and 65535.",
    });
  }
});

test("rejects wildcard, credentials, and non-origin values", () => {
  for (const CORS_ORIGINS of [
    "*", "null", "https://name:password@example.test", "https://example.test/path",
    "https://example.test?query=1", "https://example.test#fragment", "ftp://example.test", "",
  ]) {
    assert.throws(() => readEnvironment({ CORS_ORIGINS }), {
      message: "CORS_ORIGINS must contain comma-separated, exact HTTP or HTTPS origins.",
    });
  }
});
