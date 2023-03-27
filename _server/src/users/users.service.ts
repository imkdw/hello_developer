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
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UtilsService } from '../utils/utils.service';
import { ExitUserVerifyDto } from './dto/exit-user-verify.dto';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private boardRepository: BoardRepository,
    private commentRepository: CommentRepository,
    private utilsService: UtilsService,
    private awsService: AwsService,
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

  async password(tokenUserId: string, userId: string, updatePasswordDto: UpdatePasswordDto) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    const { password, rePassword } = updatePasswordDto;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    const isCompare = await this.utilsService.compare(password, user.password);
    if (!isCompare) {
      throw new BadRequestException('password_mismatch');
    }

    const hashedPassword = await this.utilsService.encrypt(rePassword);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  async exitUserVerify(tokenUserId: string, userId: string, exitUserVerifyDto: ExitUserVerifyDto) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    const { password } = exitUserVerifyDto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    const isCompare = await this.utilsService.compare(password, user.password);
    if (!isCompare) {
      throw new BadRequestException('password_mismatch');
    }

    return isCompare;
  }

  async profileImage(
    tokenUserId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    const ext = file.originalname.split('.');
    const fileName = `user_profile/${userId}.${ext}`;
    const imageUrl = await this.awsService.imageUploadToS3(fileName, file);
    await this.userRepository.profileImage(userId, imageUrl);
    return imageUrl;
  }
}
