import { IsEmail, Matches, MinLength } from 'class-validator';

export class LoginDto {
  /**
   * 이메일 유효성 검증
   * 1. 이메일 형식이 올바른지 확인(정규식 / RFC 5322)
   */
  @IsEmail({}, { message: 'Email format is invalid' })
  email: string;

  /**
   * 비밀번호 유효성 검증
   * 1. 비밀번호가 10자리 이상인지 확인
   * 2. 비밀번호가 특수문자를 포함하는지 확인
   */
  @MinLength(10, { message: 'Password format is invalid' })
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g, {
    message: 'Password format is invalid',
  })
  password: string;
}
