import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  boardId: string;

  @IsNotEmpty()
  @Length(1, 200)
  comment: string;
}
