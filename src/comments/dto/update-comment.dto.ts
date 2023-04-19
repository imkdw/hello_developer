import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @Length(1, 200)
  @ApiProperty({
    example: '수정된 댓글',
    description: '수정한 댓글',
  })
  comment: string;
}
