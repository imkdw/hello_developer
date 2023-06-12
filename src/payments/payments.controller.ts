import { Controller, Post, Body } from '@nestjs/common';
import { RequestWelpayDto } from './dto/request-welpay.dto';
import { io } from 'socket.io-client';
import * as https from 'https';

@Controller('payments')
export class PaymentsController {
  @Post('nextUrl')
  nextUrl(@Body() requestWelPayDto: RequestWelpayDto) {
    console.log(requestWelPayDto);
    const makeParam = (P_TID: string, P_MID: string): string => {
      return 'P_TID=' + P_TID + '&P_MID=' + P_MID;
    };

    const P_MID = 'welcometst';
    const { P_TID, P_REQ_URL } = requestWelPayDto;
    const socket = io(P_REQ_URL);
    // socket.emit('message', makeParam(P_TID, P_MID));

    const options = {
      hostname: P_REQ_URL,
      port: 443,
      path: '/',
      method: 'POST',
    };

    const req = https.request(options, (res) => {
      console.log('status: ', res.statusCode);

      res.on('data', (chunk) => {
        console.log('res: ', chunk);
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
