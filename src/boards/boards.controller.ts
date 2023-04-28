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
import {
  ApiCreate,
  ApiDetail,
  ApiFindAll,
  ApiImageUpload,
  ApiRecent,
  ApiRecommend,
  ApiRemove,
  ApiSearch,
  ApiUpdate,
  ApiViews,
} from './boards.swagger';

@Controller('boards')
@ApiTags('게시글 API')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * [POST] /boards - 게시글 생성 API
   * @param req
   * @param createBoardDto - 게시글 생성시 입력되는 데이터
   * @returns
   */
  @ApiCreate('게시글 생성 API')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async create(@Req() req, @Body() createBoardDto: CreateBoardDto) {
    const boardId = await this.boardsService.create(req.user.userId, createBoardDto);
    return { boardId };
  }

  /**
   * [GET] /boards?category1=&category2= - 특정 카테고리의 게시글을 모두 조회하는 API
   * @param category1 - 첫번째 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  @ApiFindAll('특정 카테고리 게시글 조회 API')
  @Get()
  async findAll(@Query('category1') category1: string, @Query('category2') category2: string) {
    const boards = await this.boardsService.findAll(category1, category2);
    return boards;
  }

  /**
   * [GET] /boards/recent - 메인페이지에 표시되는 최근게시글을 가져오는 API
   * @returns
   */
  @ApiRecent('최근 게시글 조회 API')
  @Get('recent')
  async recent() {
    const recentBoards = await this.boardsService.recent();
    return { ...recentBoards };
  }

  /**
   * [GET] /boards/search?text= - 게시글을 검색할때 사용하는 API
   * @param text - 검색어
   * @returns
   */
  @ApiSearch('게시글 검색 API')
  @Get('search')
  async search(@Query('text') text: string) {
    const result = await this.boardsService.search(text);
    return result;
  }

  /**
   * [GET] /boards/:boardId - 게시글을 상세정보 조회 API
   * @param boardId - 게시글 아이디
   * @returns
   */
  @ApiDetail('특정 게시글 조회 API')
  @Get(':boardId')
  async detail(@Param('boardId') boardId: string) {
    const board = await this.boardsService.detail(boardId);
    return board;
  }

  /**
   * [DELETE] /boards/:boardId - 게시글 삭제 API
   * @param req
   * @param boardId - 게시글 아이디
   */
  @ApiRemove('게시글 삭제 API')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':boardId')
  async remove(@Req() req, @Param('boardId') boardId: string) {
    await this.boardsService.remove(req.user.userId, boardId);
  }

  /**
   * [PATCH] /boards/:boardId - 게시글 수정 API
   * @param req
   * @param boardId - 게시글 아이디
   * @param updateBoardDto - 게시글 수정 데이터
   */
  @ApiUpdate('게시글 수정 API')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Patch(':boardId')
  async update(
    @Req() req,
    @Param('boardId') boardId: string,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
  ) {
    await this.boardsService.update(req.user.userId, updateBoardDto, boardId);
  }

  /**
   * [GET] /boards/:boardId/recommend - 게시글 추천 추가/삭제 API
   * @param req
   * @param boardId - 추천을 요청한 게시글 아이디
   */
  @ApiRecommend('게시글 추천 API')
  @UseGuards(JwtAuthGuard)
  @Get('/:boardId/recommend')
  async recommend(@Req() req, @Param('boardId') boardId: string) {
    await this.boardsService.recommend(req.user.userId, boardId);
  }

  /**
   * [GET] /boards/:boardId/views - 게시글 조회수 API
   * @param boardId - 조회한 게시글의 아이디
   */
  @ApiViews('게시글 조회수 API')
  @Get(':boardId/views')
  async views(@Param('boardId') boardId: string) {
    await this.boardsService.views(boardId);
  }

  /**
   * [POST] /boards/image - 게시글 작성/수정시 이미지 업로드 API
   * @param file - 업로드한 이미지 파일
   * @param imageUploadDto - 사진 업로드시 포함된 게시글 아이디
   * @returns 업로드된 이미지의 URL 반환
   */
  @ApiImageUpload('게시글 작성/수정시 이미지 업로드 API')
  @HttpCode(200)
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
