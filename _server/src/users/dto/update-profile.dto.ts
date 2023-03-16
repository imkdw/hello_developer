import { Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @Length(2, 8)
  @Matches(/^[^{}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]*$/)
  nickname: string;

  @Length(0, 30)
  introduce: string;
}
