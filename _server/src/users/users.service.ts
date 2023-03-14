import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor() {}
}
