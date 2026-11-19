export type ApiConfig = {
  port: number;
  corsOrigins: readonly string[];
};

export function readEnvironment(env: NodeJS.ProcessEnv): ApiConfig {
  const port = env.PORT ?? "4000";
  if (!/^\d{1,5}$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  const origins = (env.CORS_ORIGINS ?? "http://localhost:3000").split(",").map((value) => value.trim());
  const corsOrigins = origins.map((value) => {
    const url = URL.parse(value);
    if (!url || !["http:", "https:"].includes(url.protocol) || value !== url.origin) {
      throw new Error("CORS_ORIGINS must contain comma-separated, exact HTTP or HTTPS origins.");
    }
    return url.origin;
  });

  return { port: Number(port), corsOrigins: [...new Set(corsOrigins)] };
}
