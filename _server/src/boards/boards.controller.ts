import { Controller, Post, Get, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * 게시글 작성
   * @param createBoardDto - 게시글 작성 데이터
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return 'create board api';
  }

  /**
   * 게시글 목록 가져오기
   */
  @Get()
  findAll() {}

  /**
   * 게시글 상세보기
   * @param boardId - 게시글 아이디
   */
  @Get('/:id')
  findOne(@Param('id') boardId: string) {}

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
