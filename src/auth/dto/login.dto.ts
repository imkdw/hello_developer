import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'test@test.com',
    description: '회원가입한 이메일 주소',
  })
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password!@#',
    description: '회원가입한 비밀번호',
  })
  @MinLength(10)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/)
  password: string;
}
