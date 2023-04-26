import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({
    example: 'test@test.com',
    description: '회원가입시 사용되는 이메일 주소',
    required: true,
  })
  email: string;

  @Length(10, 30)
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g)
  @ApiProperty({
    example: 'password!@#',
    description: '회원가입시 사용되는 비밀번호',
    required: true,
  })
  password: string;

  @Length(2, 8)
  @Matches(/^[^{}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]*$/)
  @ApiProperty({
    example: 'testuser',
    description: '회원가입시 사용되는 닉네임',
    required: true,
  })
  nickname: string;
}
