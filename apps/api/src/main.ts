import { ConsoleLogger } from "@nestjs/common";
import { createApp } from "./app.js";
import { readEnvironment } from "./config/environment.js";

const logger = new ConsoleLogger("API");

async function start(): Promise<void> {
  let config;
  try {
    config = readEnvironment(process.env);
  } catch (error) {
    logger.error(error instanceof Error ? error.message : "Invalid API environment.");
    process.exitCode = 1;
    return;
  }

  const app = await createApp(config);
  try {
    app.enableShutdownHooks();
    await app.listen(config.port, "localhost");
    logger.log(`Health available at http://localhost:${config.port}/api/health`);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EADDRINUSE") {
      logger.error(`Port ${config.port} is already in use. Set PORT to an available port.`);
    } else {
      logger.error("Unable to start the API.");
    }
    await app.close();
    process.exitCode = 1;
  }
}

start().catch(() => {
  logger.error("Unable to initialize the API.");
  process.exitCode = 1;
});
