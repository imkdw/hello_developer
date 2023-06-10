import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'net';
import { ChatDto } from './dto/chat.dto';

@WebSocketGateway({ transports: ['websocket'] })
export class ChatGateway {
  constructor() {}
  @WebSocketServer() server: Server;

  // sendMessage 이벤트 수신
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: ChatDto): Promise<void> {
    // recMessage로 메세지 전송
    this.server.emit('recMessage', payload);
  }
}
