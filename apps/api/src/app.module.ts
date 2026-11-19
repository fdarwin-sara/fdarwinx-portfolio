import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { HttpErrorFilter } from "./common/http-error.filter.js";
import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [
    HealthModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
