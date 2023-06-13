import { Controller, Post, Body, Get, Redirect } from '@nestjs/common';
import { RequestWelpayDto } from './dto/request-welpay.dto';
import { io } from 'socket.io-client';
import * as https from 'https';
import * as iconv from 'iconv-lite';
import { ResponseWelPayDto } from './dto/response-welpay.dtk';

@Controller('payments')
export class PaymentsController {
  @Post('nextUrl')
  @Redirect() // Redirect 데코레이터 사용
  async nextUrl(@Body() requestWelPayDto: RequestWelpayDto) {
    const makeParam = (P_TID: string, P_MID: string): string => {
      const param = 'P_TID=' + P_TID + '&P_MID=' + P_MID;
      return param;
    };

    const P_MID = 'welcometst';
    const { P_TID, P_REQ_URL } = requestWelPayDto;

    const options = {
      hostname: 'tmobile.paywelcome.co.kr',
      port: 443,
      path: `/smart/payReq.ini?${makeParam(P_TID, P_MID)}`,
      method: 'POST',
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log('status: ', res.statusCode);

        res.on('data', (chunk) => {
          const parsedChunk = iconv.decode(chunk, 'euc-kr');
          console.log(parsedChunk);

          const params = new URLSearchParams(parsedChunk);
          const data: ResponseWelPayDto = {
            P_STATUS: params.get('P_STATUS') || '',
            P_TID: params.get('P_TID') || '',
            P_TYPE: params.get('P_TYPE') || '',
            P_AUTH_DT: params.get('P_AUTH_DT') || '',
            P_MID: params.get('P_MID') || '',
            P_OID: params.get('P_OID') || '',
            P_AMT: params.get('P_AMT') || '',
            P_UNAME: params.get('P_UNAME') || '',
            P_MNAME: params.get('P_MNAME') || '',
            P_RMESG1: params.get('P_RMESG1') || '',
            P_NOTI: params.get('P_NOTI') || '',
            P_NOTEURL: params.get('P_NOTEURL') || '',
            P_NEXT_URL: params.get('P_NEXT_URL') || '',
          };

          for (const [key, value] of params.entries()) {
            data[key] = value;
          }

          const responseWelPayDto = new ResponseWelPayDto();
          responseWelPayDto.P_OID = data.P_OID;

          // 리다이렉트할 URL 반환
          resolve({
            url: `https://hdev.site/payments/result?P_OID=${responseWelPayDto.P_OID}`,
          });
        });
      });

      req.on('error', (error) => {
        console.error(error);
        // 에러 발생 시 리다이렉트할 URL 반환
        reject({
          url: 'https://hdev.site/payments/result?error=true',
        });
      });

      req.write(makeParam(P_TID, P_MID));
      req.end();
    });
  }
}
