import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@test.com',
    description: '회원가입한 이메일 주소',
  })
  email: string;

  @MinLength(10)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/)
  @ApiProperty({
    example: 'password!@#',
    description: '회원가입한 비밀번호',
  })
  password: string;
}
