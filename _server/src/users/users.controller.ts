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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ValidationPipe } from '../pipes/validation.pipe';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * [GET] /users/:userId - 유저의 프로필 가져오기
   * @param userId - 프로필을 조회할 유저의 아이디
   */
  @Get('/:userId')
  async profile(@Param('userId') userId: string) {
    const profile = await this.usersService.profile(userId);
    return profile;
  }

  /**
   * [PATCH] /users/:userId - 유저의 프로필 수정하기
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
   * [DELETE] /users/:userId - 회원 탈퇴
   * @param userId - 탈퇴할 유저의 아이디
   */
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  async remove(@Req() req, @Param('userId') userId: string) {
    await this.usersService.remove(req.user.userId, userId);
  }

  /**
   * [GET] /users/:userId/history - 유저의 히스토리(활동내역) 가져오기
   * @param userId - 히스토리(활동내역)를 가져올 유저의 아이디
   */
  @Get('/:userId/history')
  async history(@Param('userId') userId: string, @Query('item') item: string) {
    const history = await this.usersService.history(userId, item);
    return history;
  }
}
