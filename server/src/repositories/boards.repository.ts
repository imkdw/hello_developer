import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsEntity } from 'src/entities/boards.entity';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { BoardsCategoryEntity, defaultCategorys } from 'src/entities/boards-category.entity';
import { BoardTagsEntity, TagsEntity } from 'src/entities/tags.entity';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectRepository(BoardsEntity)
    private readonly boardsRepository: Repository<BoardsEntity>,
    @InjectRepository(BoardsCategoryEntity)
    private readonly boardsCategoryRepository: Repository<BoardsCategoryEntity>,
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(BoardTagsEntity)
    private readonly boardTagsRepository: Repository<BoardTagsEntity>,
  ) {}

  async createBoard(createdBoardDto: CreateBoardDto) {
    const { title, content, category, tags } = createdBoardDto;
    const categoryIds = await this.findCategoryIdByNames(category);

    const newBoard = new BoardsEntity();
    newBoard.userId = 'temp-user-id';
    newBoard.title = title;
    newBoard.content = content;
    newBoard.categoryId1 = categoryIds[0];
    newBoard.categoryId2 = categoryIds[1] ? categoryIds[1] : null;
    const boardId = (await this.boardsRepository.save(newBoard)).boardId;

    const tagIds = await this.saveTagsAndReturnId(tags);
    await this.saveBoardTags(boardId, tagIds);
  }

  // board_tags 조인테이블에 데이터 저장
  async saveBoardTags(boardId: string, tagIds: number[]) {
    for (const tagId of tagIds) {
      const newBoardTag = new BoardTagsEntity();
      newBoardTag.boardId = boardId;
      newBoardTag.tagId = tagId;
      await this.boardTagsRepository.save(newBoardTag);
    }
  }

  // 게시글 태그 저장 및 아이디 반환
  async saveTagsAndReturnId(tags: { [name: string]: string }[]): Promise<number[] | never[]> {
    const tagsId = await Promise.all(
      tags
        .map(async (tag) => {
          if (tag.name.trim().length === 0) {
            return null;
          }

          const tagRows = await this.tagsRepository.findOne({ where: { name: tag.name.toLowerCase() } });

          let tagId;
          if (!tagRows) {
            const newTag = new TagsEntity();
            newTag.name = tag.name.toLowerCase();
            const addTagResult = await this.tagsRepository.save(newTag);
            tagId = addTagResult.tagId;
          } else {
            tagId = tagRows.tagId;
          }

          return tagId;
        })
        .filter((tagId) => tagId),
    );

    return tagsId || [];
  }

  // 카테고리 이름으로 아이디 조회
  async findCategoryIdByNames(categorys: string) {
    const categoryNames = categorys.split('-');
    const categoryIds = await Promise.all(
      categoryNames.map(async (name) => {
        const row = await this.boardsCategoryRepository.findOne({ where: { name } });
        return row.categoryId;
      }),
    );

    return categoryIds;
  }

  // board_category에 기본 데이터 저장
  async createDefaultCategorys() {
    for (const defaultCategory of defaultCategorys) {
      const user = this.boardsCategoryRepository.create(defaultCategory);
      await this.boardsCategoryRepository.save(user);
    }
  }
}
