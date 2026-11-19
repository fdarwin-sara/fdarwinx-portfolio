import { STATUS_CODES } from "node:http";
import { Catch, ConsoleLogger, HttpException } from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new ConsoleLogger("HTTP");

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const adapter = this.adapterHost.httpAdapter;
    const response = host.switchToHttp().getResponse();

    if (status >= 500) this.logger.error(`Request failed with HTTP ${status}.`);
    if (adapter.isHeadersSent(response)) {
      adapter.end(response);
      return;
    }
    adapter.reply(response, { statusCode: status, message: STATUS_CODES[status] ?? "Request failed" }, status);
  }
}
