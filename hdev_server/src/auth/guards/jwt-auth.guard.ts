import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // async handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): Promise<TUser> {
  //   // accessToken이 만료되었을 경우
  //   if (err || !user) {
  //     // refreshToken 검증 시도
  //     const refreshData = await this.authService.verifyRefreshToken(context.req.cookies.refreshToken);
  //     if (refreshData) {
  //       // refresh token 검증 성공시, 새로운 access token을 발급하고 요청을 처리한다.
  //       const accessToken = await this.authService.generateAccessToken(refreshData.userId);
  //       context.req.headers.authorization = `Bearer ${accessToken}`;
  //       return super.canActivate(context);
  //     }
  //   }
  //   // access token이 유효한 경우
  //   return user;  
  // }
}
