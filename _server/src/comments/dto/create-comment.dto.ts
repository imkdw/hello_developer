import { IsNotEmpty, Length } from 'class-validator';

export class createCommentDto {
  @IsNotEmpty()
  boardId: string;

  @IsNotEmpty()
  @Length(1, 200)
  content: string;
}
