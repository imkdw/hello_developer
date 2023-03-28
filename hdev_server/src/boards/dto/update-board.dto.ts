import {
  MinLength,
  MaxLength,
  NotEquals,
  IsArray,
  ArrayMaxSize,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class UpdateBoardDto {
  /**
   * 1. 제목은 1~50자로 설정 필요
   */
  @IsNotEmpty()
  @Length(1, 50)
  title: string;

  /**
   * 1. 본문의 내용은 1 ~ 100,000자 사이의 내용으로 구성되야함
   */
  @IsNotEmpty()
  @Length(1, 100000)
  content: string;

  /**
   * 1. 카테고리가 none으로 입력되지 않아야함
   */
  @IsNotEmpty()
  @NotEquals('none')
  category: string;

  /**
   * 1. 각 태그의 name의 길이는 10자로 제한
   */
  @IsArray()
  @ArrayMaxSize(3)
  tags: {
    name: string;
  }[];
}
