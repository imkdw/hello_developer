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
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('사용자 API')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * [GET] /users/:userId - 유저의 프로필 조회 API
   * @param userId - 프로필을 조회할 유저의 아이디
   */
  @ApiOperation({ summary: '사용자 정보조회 API' })
  @ApiOkResponse({
    description: '사용자 정보조회 성공시 유저정보 반환',
    schema: {
      properties: {
        nickname: { type: 'string' },
        introduce: { type: 'string' },
        profileImg: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '조회하고자 하는 사용자가 존재하지 않을경우',
    schema: {
      properties: {
        statusCode: { example: 404 },
        message: { example: 'user_not_found' },
      },
    },
  })
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
  @ApiOperation({ summary: '사용자 정보 수정 API' })
  @ApiNoContentResponse({ description: '사용자 정보 수정 성공시' })
  @ApiUnauthorizedResponse({
    description: '수정을 요청한 유저와 실제 유저가 일치하지 않는경우',
    schema: {
      properties: {
        statusCode: { example: 401 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
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
  @ApiOperation({ summary: '회원탈퇴 API' })
  @ApiNoContentResponse({ description: '회원탈퇴에 성공시' })
  @ApiUnauthorizedResponse({
    description: '삭제를 요청한 유저와 실제 유저가 일치하지 않는경우',
    schema: {
      properties: {
        statusCode: { example: 401 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
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
  @ApiOperation({
    summary: '회원 활동내역 조회 API',
    description: 'item(board, comment)에 따라서 개별로 반환',
  })
  @ApiOkResponse({
    description: '회원 활동내역 조회 성공시 활동내역 반환',
    schema: {
      properties: {
        boardOrComment: {
          type: 'array',
          example: [
            {
              boardId: 'string',
              title: 'string',
              createdAt: 'string',
              category1: { name: 'string' },
              category2: { name: 'string' },
            },
          ],
        },
      },
    },
  })
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
  @ApiOperation({ summary: '사용자의 프로필 사진을 변경하는 API' })
  @ApiOkResponse({
    description: '변경에 성공한 경우 변경된 프로필사진 URL 반환',
    schema: {
      properties: {
        imageUrl: { example: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '변경을 요청한 사용자와 실제 사용자가 다를경우',
    schema: {
      properties: {
        statusCode: { example: 401 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없는경우',
    schema: {
      properties: {
        statusCode: { example: 404 },
        message: { example: 'user_not_found' },
      },
    },
  })
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
  @ApiOperation({ summary: '사용자 비밀번호 변경 API' })
  @ApiNoContentResponse({
    description: '비밀번호 변경 성공시',
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없는경우',
    schema: {
      properties: {
        statusCode: { example: 404 },
        message: { example: 'user_not_found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '변경을 요청한 사용자와 실제 사용자가 다를경우',
    schema: {
      properties: {
        statusCode: { example: 401 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '현재 비밀번호가 일치하지 않는 경우',
    schema: {
      properties: {
        statusCode: { example: 400 },
        message: { example: 'password_mismatch' },
      },
    },
  })
  @ApiBadRequestResponse({})
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
   * [PATCH] /users/:userId/verify - 회원탈퇴 전 유저검증 API
   * @param req
   * @param exitUserVerifyDto - 비밀번호
   * @param userId - 유저의 아이디
   * @returns
   */
  @ApiOperation({ summary: '회원탈퇴 전 유저검증 API' })
  @ApiOkResponse({
    description: '비밀번호 검증에 성공한 경우',
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없는경우',
    schema: {
      properties: {
        statusCode: { example: 404 },
        message: { example: 'user_not_found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '변경을 요청한 사용자와 실제 사용자가 다를경우',
    schema: {
      properties: {
        statusCode: { example: 401 },
        message: { example: 'unauthorized_user' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '현재 비밀번호가 일치하지 않는 경우',
    schema: {
      properties: {
        statusCode: { example: 400 },
        message: { example: 'password_mismatch' },
      },
    },
  })
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
