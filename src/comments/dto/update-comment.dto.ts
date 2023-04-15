import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @Length(1, 200)
  comment: string;
}
