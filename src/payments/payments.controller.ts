import { Controller, Post, Body } from '@nestjs/common';
import { RequestWelpayDto } from './dto/request-welpay.dto';
import { io } from 'socket.io-client';
import * as https from 'https';
import * as iconv from 'iconv-lite';

@Controller('payments')
export class PaymentsController {
  @Post('nextUrl')
  nextUrl(@Body() requestWelPayDto: RequestWelpayDto) {
    console.log(requestWelPayDto);
    const makeParam = (P_TID: string, P_MID: string): string => {
      const param = 'P_TID=' + P_TID + '&P_MID=' + P_MID;
      console.log('param: ', param);
      return param;
    };

    const P_MID = 'welcometst';
    const { P_TID, P_REQ_URL } = requestWelPayDto;
    const socket = io(P_REQ_URL);
    // socket.emit('message', makeParam(P_TID, P_MID));

    const options = {
      hostname: 'tmobile.paywelcome.co.kr',
      port: 443,
      path: `/smart/payReq.ini?${makeParam(P_TID, P_MID)}`,
      method: 'POST',
    };

    const req = https.request(options, (res) => {
      console.log('status: ', res.statusCode);

      res.on('data', (chunk) => {
        console.log('res: ', iconv.decode(chunk, 'euc-kr'));
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });

    req.write(makeParam(P_TID, P_MID));
    req.end();

    return JSON.stringify(requestWelPayDto);
  }
}
