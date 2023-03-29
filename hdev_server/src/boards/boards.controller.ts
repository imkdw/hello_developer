import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  HttpCode,
  Patch,
  Header,
  Body,
  Query,
} from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { ValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadDto } from './dto/image-upload.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger/dist';
import { ApiBadRequestResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller('boards')
@ApiTags('게시글 API')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: '게시글 생성 API', description: '새로운 게시글을 생성' })
  @ApiCreatedResponse({ description: '새로운 게시글을 생성', type: '게시글 아이디' })
  async create(@Req() req, @Body() createBoardDto: CreateBoardDto) {
    const boardId = await this.boardsService.create(req.user.userId, createBoardDto);
    return { boardId };
  }

  /**
   * 특정 카테고리 게시글 목록 가져오기
   * @param category1 - 첫번쨰 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  @Get()
  async findAll(@Query('category1') category1: string, @Query('category2') category2: string) {
    const boards = await this.boardsService.findAll(category1, category2);
    return boards;
  }

  /**
   * 게시글 상세보기
   * @param boardId - 게시글 아이디
   */
  @Get(':boardId')
  async findOne(@Param('boardId') boardId: string) {
    const board = await this.boardsService.findOne(boardId);
    return board;
  }

  /**
   * 게시글 삭제
   * @param boardId - 삭제 요청한 게시글 아이디
   */
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':boardId')
  async remove(@Req() req, @Param('boardId') boardId: string) {
    await this.boardsService.remove(req.user.userId, boardId);
  }

  /**
   * 게시글 수정
   * @param updateBoardDto - 게시글을 수정한 데이터
   * @param boardId - 수정요청한 게시글 아이디
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':boardId')
  async update(
    @Req() req,
    @Param('boardId') boardId: string,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
  ) {
    await this.boardsService.update(req.user.userId, updateBoardDto, boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:boardId/recommend')
  async recommend(@Req() req, @Param('boardId') boardId: string) {
    await this.boardsService.recommend(req.user.userId, boardId);
  }

  @Get(':boardId/views')
  async views(@Param('boardId') boardId: string) {
    await this.boardsService.views(boardId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('image')
  async imageUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() imageUploadDto: ImageUploadDto,
  ) {
    const imageUrl = await this.boardsService.imageUpload(file, imageUploadDto);
    return imageUrl;
  }
}
