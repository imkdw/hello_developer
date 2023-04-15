import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  Query,
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ValidationPipe } from '../pipes/validation.pipe';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ExitUserVerifyDto } from './dto/exit-user-verify.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';

@Controller('users')
@ApiTags('사용자 API')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * [GET] /users/:userId - 유저의 프로필 조회 API
   * @param userId - 프로필을 조회할 유저의 아이디
   */
  @Get('/:userId')
  async profile(@Param('userId') userId: string) {
    const profile = await this.usersService.profile(userId);
    return profile;
  }

  /**
   * [PATCH] /users/:userId - 유저의 프로필 수정 API
   * @param updateProfileDto - 수정할 프로필 데이터
   * @param userId - 프로필을 수정할 유저의 아이디
   */
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Patch('/:userId')
  async update(
    @Req() req,
    @Param('userId') userId: string,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    await this.usersService.update(req.user.userId, userId, updateProfileDto);
  }

  /**
   * [DELETE] /users/:userId - 회원 탈퇴 API
   * @param userId - 탈퇴할 유저의 아이디
   */
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  async remove(@Req() req, @Param('userId') userId: string) {
    await this.usersService.remove(req.user.userId, userId);
  }

  /**
   * [GET] /users/:userId/history?item= - 유저의 히스토리(활동내역) 조회 API
   * @param userId - 히스토리(활동내역)를 가져올 유저의 아이디
   */
  @Get('/:userId/history')
  async history(@Param('userId') userId: string, @Query('item') item: string) {
    const history = await this.usersService.history(userId, item);
    return history;
  }

  /**
   * [POST] /users/:userId/image - 유저의 프로필사진 변경 API
   * @param file - 클라이언트에서 업로드된 파일
   * @param userId - 업로드를 요청한 유저의 아이디
   */
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post(':userId/image')
  async profileImage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
  ) {
    const imageUrl = await this.usersService.profileImage(req.user.userId, userId, file);
    return { profileImg: imageUrl };
  }

  /**
   * [PATCH] /users/:userId/password - 비밀번호 변경 API
   * @param req
   * @param updatePasswordDto - 기존 비밀번호화 변경할 비밀번호
   * @param userId - 변경을 요청한 사용자 아이디
   */
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Patch(':userId/password')
  async password(
    @Req() req,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
    @Param('userId') userId: string,
  ) {
    await this.usersService.password(req.user.userId, userId, updatePasswordDto);
  }

  /**
   * [PATCH] /users/:userId/verify - 비밀번호 변경 전 유저검증 API
   * @param req
   * @param exitUserVerifyDto - 비밀번호
   * @param userId - 유저의 아이디
   * @returns
   */
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Patch(':userId/verify')
  async exitUserVerify(
    @Req() req,
    @Body() exitUserVerifyDto: ExitUserVerifyDto,
    @Param('userId') userId: string,
  ) {
    return await this.usersService.exitUserVerify(req.user.userId, userId, exitUserVerifyDto);
  }
}
