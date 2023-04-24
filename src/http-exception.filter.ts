import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as Sentry from '@sentry/node';
import { WebClient } from '@slack/web-api';

const getKoreaTime = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  webClient: WebClient;

  constructor(private configService: ConfigService) {
    this.webClient = new WebClient(this.configService.get<string>('slack.token'));
  }
  private logger = new Logger('ErrorLogger');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status >= 500) {
      this.logger.error(exception, 'HTTP 500 Internal Server Error');
      Sentry.init({
        dsn: this.configService.get<string>('sentry.dsn'),
        tracesSampleRate: 1.0,
      });
      Sentry.captureException(exception);

      this.webClient.chat.postMessage({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '❌ New Internal Server Error',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Message:*\n${exception.message}`,
              },
              {
                type: 'mrkdwn',
                text: `*When:*\n${getKoreaTime()}`,
              },
              {
                type: 'mrkdwn',
                text: `*Exception:*\n${exception}`,
              },
              {
                type: 'mrkdwn',
                text: `*Request URL:*\n${request.url}`,
              },
            ],
          },
        ],
        channel: this.configService.get<string>('slack.logChannelId'),
      });
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
