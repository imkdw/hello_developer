import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CategoryRepository } from './category/category.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Tag } from './tag/tag.entity';
import { TagRepository } from './tag/tag.repository';
import { ViewRepository } from './view/view.repository';

@Injectable()
export class BoardsService {
  constructor(
    private boardRepository: BoardRepository,
    private categoryRepository: CategoryRepository,
    private tagRepository: TagRepository,
    private viewRepository: ViewRepository,
  ) {}

  /**
   * 게시글 생성
   * @param userId - 작성자 아이디
   * @param createBoardDto - 게시글 생성 데이터
   */
  async create(userId: string, createBoardDto: CreateBoardDto) {
    const { title, content, category, tags } = createBoardDto;

    const categoryIds = await this.categoryRepository.findIdByName(category);
    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    const tagsArr = [];
    for (const tag of tags) {
      if (tag.name.length === 0) {
        continue;
      }

      const existTag = await this.tagRepository.findByName(tag.name);

      if (existTag) {
        tagsArr.push(existTag);
      } else {
        const newTag = new Tag();
        newTag.name = tag.name;
        tagsArr.push(newTag);
      }
    }

    const newBoard = new Board();
    newBoard.userId = userId;
    newBoard.title = title;
    newBoard.content = content;
    newBoard.categoryId1 = categoryIds[0];
    newBoard.categoryId2 = categoryIds[1] || null;
    newBoard.tags = tagsArr;
    const boardId = await this.boardRepository.create(newBoard);

    await this.viewRepository.create(boardId);

    return boardId;
  }

  /**
   * 특정 카테고리의 모든 게시글 가져오기
   * @param category1 - 첫번째 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  async findAll(category1: string, category2: string) {
    const categoryIds = await this.categoryRepository.findIdByName(category1 + '-' + category2);
    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    const boards = await this.boardRepository.findAll(categoryIds);

    return boards;
  }

  /**
   * 특정 게시글 가져오기
   * @param boardid - 특정 게시글 아이디
   */
  async findOne(boardId: string) {
    const board = await this.boardRepository.findOne(boardId);

    if (!board) {
      throw new NotFoundException('board_not_found');
    }

    return board;
  }

  /**
   * 게시글 삭제
   * @param userId - 삭제를 요청한 ID
   * @param boardId - 게시글 ID
   */
  async remove(userId: string, boardId: string) {
    const board = await this.boardRepository.findOne(boardId);

    if (!board) {
      throw new NotFoundException('board_not_found');
    }

    /** 작성자와 삭제요청 유저가 일치할때만 글 삭제 */
    if (board.user.userId === userId) {
      await this.boardRepository.remove(userId, boardId);
    } else {
      throw new UnauthorizedException('unauthorized_user');
    }
  }

  /**
   * 게시글 수정
   * @param userId - 게시글 수정을 요청한 유저 아이디
   * @param updateBoardDto - 게시글 수정 데이터
   * @param boardId - 게시글 수정을 요청한 아이디
   */
  async update(userId: string, updateBoardDto: UpdateBoardDto, boardId: string) {
    const { tags, category } = updateBoardDto;

    const categoryIds = await this.categoryRepository.findIdByName(category);
    if (!categoryIds[0]) {
      throw new BadRequestException('invalid_category');
    }

    const updatedTags = [];
    for (const tag of tags) {
      const existTag = await this.tagRepository.findByName(tag.name);

      if (existTag) {
        updatedTags.push(existTag);
      } else {
        const tagId = await this.tagRepository.create(tag.name);
        updatedTags.push({ tagId, name: tag.name });
      }
    }

    await this.boardRepository.update(userId, boardId, updateBoardDto, categoryIds, updatedTags);
  }
}
