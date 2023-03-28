import { Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(10)
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g)
  password: string;

  @MinLength(10)
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g)
  rePassword: string;
}
