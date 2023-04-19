import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'string',
    description: '댓글을 작성할 게시글의 ID',
  })
  boardId: string;

  @IsNotEmpty()
  @Length(1, 200)
  @ApiProperty({
    example: 'commet',
    description: '작성을 요청하는 댓글 내용',
  })
  comment: string;
}
