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

@Controller('boards')
@ApiTags('게시글 API')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * [POST] /boards - 게시글 생성 API
   * 유저가 새로운 게시글을 작성할때 사용
   * @param req
   * @param createBoardDto - 게시글 생성시 입력되는 데이터
   * @returns
   */
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
   * [GET] /boards?category1=&category2= - 특정 카테고리의 게시글을 모두 조회하는 API
   * 특정 카테고리의 게시글을 모두 조회할때 사용
   * @param category1 - 첫번째 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  @Get()
  async findAll(@Query('category1') category1: string, @Query('category2') category2: string) {
    const boards = await this.boardsService.findAll(category1, category2);
    return boards;
  }

  /**
   * [GET] /boards/recent - 메인페이지에 표시되는 최근게시글을 가져오는 API
   * 메인페이지에 출력되는 최근게시글을 가져올때 사용
   * @returns
   */
  @Get('recent')
  async recent() {
    const recentBoards = await this.boardsService.recent();
    return { ...recentBoards };
  }

  /**
   * [GET] /boards/search?text= - 게시글을 검색할때 사용하는 API
   * 제목을 기준으로 게시글을 검색할때 사용할때 사용
   * @param text - 검색어
   * @returns
   */
  @Get('search')
  async search(@Query('text') text: string) {
    const result = await this.boardsService.search(text);
    return result;
  }

  /**
   * [GET] /boards/:boardId - 게시글을 상세정보 조회 API
   * 게시글을 클릭했을때 상세내용을 확인하기위해 사용
   * @param boardId - 게시글 아이디
   * @returns
   */
  @Get(':boardId')
  async detail(@Param('boardId') boardId: string) {
    const board = await this.boardsService.detail(boardId);
    return board;
  }

  /**
   * [DELETE] /boards/:boardId - 게시글 삭제 API
   * 게시글을 삭제할때 사용
   * @param req
   * @param boardId - 게시글 아이디
   */
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':boardId')
  async remove(@Req() req, @Param('boardId') boardId: string) {
    await this.boardsService.remove(req.user.userId, boardId);
  }

  /**
   * [PATCH] /boards/:boardId - 게시글 수정 API
   * 게시글을 수정할 때 사용
   * @param req
   * @param boardId - 게시글 아이디
   * @param updateBoardDto - 게시글 수정 데이터
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
