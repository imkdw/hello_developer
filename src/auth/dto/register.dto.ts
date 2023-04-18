import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'test@test.com',
    description: '회원가입시 사용되는 이메일 주소',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password!@#',
    description: '회원가입시 사용되는 비밀번호',
    required: true,
  })
  @MinLength(10)
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g)
  password: string;

  @ApiProperty({
    example: 'testuser',
    description: '회원가입시 사용되는 닉네임',
    required: true,
  })
  @MinLength(2)
  @MaxLength(8)
  @Matches(/^[^{}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]*$/)
  nickname: string;
}
