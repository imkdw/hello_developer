import { Body, Controller, Post, Get, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * [POST] /boards - 게시글 생성 API
   * @param createBoardDto - 게시글 생성시 사용되는 데이터
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Req() req, @Body() createBoardDto: CreateBoardDto) {
    const userId = req.user.userId;
    await this.boardsService.createBoard(userId, createBoardDto);
  }

  /**
   * /boards/:id - 게시글 조회
   * @param id - 게시글 아이디
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.boardsService.findOne(id);
  }

  /**
   * /boards - 게시글 목록
   */
  @Get()
  async findAll() {}
}
