import { Controller, Post, Body, Get, Redirect } from '@nestjs/common';
import { RequestWelpayDto } from './dto/request-welpay.dto';
import { io } from 'socket.io-client';
import * as https from 'https';
import * as iconv from 'iconv-lite';
import { ResponseWelPayDto } from './dto/response-welpay.dtk';

@Controller('payments')
export class PaymentsController {
  @Post('nextUrl')
  @Redirect()
  nextUrl(@Body() requestWelPayDto: RequestWelpayDto) {
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

    const req = https.request(options, (res) => {
      console.log('status: ', res.statusCode);

      res.on('data', (chunk) => {
        const parsedChunk = JSON.parse(iconv.decode(chunk, 'euc-kr'));
        const responseWelPayDto = new ResponseWelPayDto();
        console.log(parsedChunk);
        responseWelPayDto.P_OID = parsedChunk.P_OID;
        return {
          url: `https://hdev.site/payments/result?P_OID=${responseWelPayDto.P_OID}`,
        };
      });
    });

    req.on('error', (error) => {
      console.error(error);
      return {
        url: 'https://hdev.site/payments/result?error=true',
      };
    });

    req.write(makeParam(P_TID, P_MID));
    req.end();
  }

  @Get('test')
  @Redirect()
  test() {
    console.log('리다이렉트 호출');
    return {
      url: 'https://hdev.site/payments/result?P_OID=tst_12421321312',
    };
  }
}
