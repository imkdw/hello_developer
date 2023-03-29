import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { NotEquals, IsArray, ArrayMaxSize, Length, IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  /**
   * 임시 게시글 아이디
   */
  @ApiProperty({
    example: '게시글 작성시 자동생성(UUID)',
    description: 'temp_board_id',
    required: true,
  })
  tempBoardId: string;

  /**
   * 1. 제목은 1~50자로 설정 필요
   */
  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({
    example: '게시글 제목입니다',
    description: '게시글 제목',
    required: true,
  })
  title: string;

  /**
   * 1. 본문의 내용은 1 ~ 100,000자 사이의 내용으로 구성되야함
   */
  @IsNotEmpty()
  @Length(1, 100000)
  @ApiProperty({
    example: '게시글 본문(내용)입니다',
    description: '게시글 내용',
    required: true,
  })
  content: string;

  /**
   * 1. 카테고리가 none으로 입력되지 않아야함
   */
  @IsNotEmpty()
  @NotEquals('none')
  @ApiProperty({
    example: 'qna-tech',
    description: '게시글 카테고리',
    required: true,
  })
  category: string;

  /**
   * 1. 각 태그의 name의 길이는 10자로 제한
   */
  @IsArray()
  @ArrayMaxSize(3)
  @ApiProperty({
    example: '[{name: "태그"}]',
    description: '게시글 태그',
    required: true,
  })
  tags: {
    name: string;
  }[];
}
