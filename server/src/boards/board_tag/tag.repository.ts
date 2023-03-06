import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  /**
   * 게시글의 태그를 저장하고 해당 태그의 아이디를 반환
   * @param tags - 태그 목록
   * @returns
   */
  async saveTagsAndReturnId(tags: { [name: string]: string }[]): Promise<number[] | never[]> {
    const tagsId = await Promise.all(
      tags
        .map(async (tag) => {
          if (tag.name.trim().length === 0) {
            return null;
          }

          const tagRows = await this.tagRepository.findOne({ where: { name: tag.name.toLowerCase() } });

          let tagId: number;
          if (!tagRows) {
            const newTag = new TagEntity();
            newTag.name = tag.name.toLowerCase();
            const addTagResult = await this.tagRepository.save(newTag);
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
}
