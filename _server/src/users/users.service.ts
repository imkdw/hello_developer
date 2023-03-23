import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Board } from 'src/boards/board.entity';
import { BoardRepository } from '../boards/board.repository';
import { CommentRepository } from '../comments/comment.repostiroy';
import { Comment } from '../comments/comment.entity';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private boardRepository: BoardRepository,
    private commentRepository: CommentRepository,
  ) {}

  async profile(userId: string) {
    const profile = await this.userRepository.profile(userId);

    if (!profile) {
      throw new NotFoundException('user_not_found');
    }

    return profile;
  }

  async update(tokenUserId: string, userId: string, updateProfileDto: UpdateProfileDto) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    await this.userRepository.update(userId, updateProfileDto);
  }

  async remove(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    await this.userRepository.remove(userId);
  }

  async history(userId: string, item: string) {
    if (!['board', 'comment'].includes(item)) {
      throw new BadRequestException('invalid_item');
    }

    let history: Board[] | Comment[] | null;

    switch (item) {
      case 'board':
        history = await this.boardRepository.findHistoryByUserId(userId);
        break;

      case 'comment':
        history = await this.commentRepository.findHistoryByUserId(userId);
        break;
    }

    return history;
  }
}
