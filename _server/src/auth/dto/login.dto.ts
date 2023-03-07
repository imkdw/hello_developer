import { IsEmail, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  private email: string;

  @MinLength(10)
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g)
  private password: string;
}
