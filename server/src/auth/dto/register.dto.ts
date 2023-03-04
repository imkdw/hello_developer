import {
  IsString,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
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

  /**
   * 닉네임 유효성 검증
   * 1. 닉네임이 2자리 이상, 8자리 이하인지 확인
   * 2. 닉네임에 특수문자가 미포함 되어있는지 확인
   */
  @MinLength(2, { message: 'Nickname format is invalid' })
  @MaxLength(8, { message: 'Nickname format is invalid' })
  @Matches(/^[^{}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]*$/, {
    message: 'Nickname format is invalid',
  })
  nickname: string;
}
