import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module.js";
import type { ApiConfig } from "./config/environment.js";

export async function createApp(config: ApiConfig): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    bodyParser: false,
    logger: false,
  });

  app.set("trust proxy", false);
  app.use(helmet());
  app.enableCors({
    origin: [...config.corsOrigins],
    methods: ["GET", "HEAD"],
    credentials: false,
  });
  app.useBodyParser("json", { limit: "16kb", inflate: false });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    disableErrorMessages: true,
  }));
  app.setGlobalPrefix("api");

  return app;
}
