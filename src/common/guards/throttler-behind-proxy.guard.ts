import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.ips.leng;
  }
}
