import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * /boards - 게시글 생성
   * @param */
  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    await this.boardsService.createBoard(createBoardDto);
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
