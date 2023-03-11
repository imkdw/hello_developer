import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Body, Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardValidationPipe } from './pipes/board-validation.pipe';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * 게시글 작성
   * @param createBoardDto - 게시글 작성 데이터
   */
  @UsePipes(BoardValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post()
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
  @Get('/:id')
  async findOne(@Param('id') boardId: string) {
    const board = await this.boardsService.findOne(boardId);
    return board;
  }

  /**
   * 게시글 삭제
   */
  @Delete('/:id')
  remove(@Param('id') boardId: string) {}

  /**
   * 게시글 수정
   */
  @Put('/:id')
  update(@Body() updateBoardDto: UpdateBoardDto, @Param('id') boardId: string) {}
}
