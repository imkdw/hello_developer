import { Controller, Post, Body } from '@nestjs/common';
import { RequestWelpayDto } from './dto/request-welpay.dto';
import { io } from 'socket.io-client';

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
    socket.emit('message', makeParam(P_TID, P_MID));
    socket.on('message', (data: any) => console.log(data));
    return JSON.stringify(requestWelPayDto);
  }
}
