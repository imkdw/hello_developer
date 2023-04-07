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

  /**
   * 사용자 프로필 조회
   * @param userId - 사용자 아이디
   * @returns
   */
  async profile(userId: string) {
    const profile = await this.userRepository.profile(userId);

    if (!profile) {
      throw new NotFoundException('user_not_found');
    }

    return profile;
  }

  /**
   * 사용자 프로필 업데이트
   * @param tokenUserId - 토큰에 포함된 유저의 아이디
   * @param userId - 유저 아이디
   * @param updateProfileDto - 프로필 업데이트 데이터
   */
  async update(tokenUserId: string, userId: string, updateProfileDto: UpdateProfileDto) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    await this.userRepository.update(userId, updateProfileDto);
  }

  /**
   * 회원 탈퇴
   * @param tokenUserId - 토큰에 포함된 유저의 아이디
   * @param userId - 유저 아이디
   */
  async remove(tokenUserId: string, userId: string) {
    if (tokenUserId !== userId) {
      throw new UnauthorizedException('unauthorized_user');
    }

    await this.userRepository.remove(userId);
  }

  /**
   * 회원정보 조회
   * @param userId - 유저 아이디
   * @param item - 게시글 또는 댓글 아이템
   * @returns
   */
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

  /**
   * 비밀번호 변경
   * @param tokenUserId - 토큰에 포함된 유저의 아이디
   * @param userId - 변경 요청한 유저의 아이디
   * @param updatePasswordDto - 기존 비밀번호와 변경 비밀번호
   */
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

  /**
   * 회원탈퇴시 유저인증
   * @param tokenUserId - 토큰에 포함된 유저의 아이디
   * @param userId - 인증을 요청한 유저의 아이디
   * @param exitUserVerifyDto - 인증 요청시 입력된 데이터
   * @returns
   */
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

  /**
   * 사용자 프로필사진 변경
   * @param tokenUserId - 토큰에 포함된 유저의 아이디
   * @param userId - 변경을 요청한 사용자 아이디
   * @param file - 업로드한 이미지 파일
   * @returns
   */
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
