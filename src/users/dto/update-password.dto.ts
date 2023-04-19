import { ApiProperty } from '@nestjs/swagger';
import { Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(10)
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g)
  @ApiProperty({
    example: 'password!@#',
    description: '기존 비밀번호',
    required: true,
  })
  password: string;

  @MinLength(10)
  @Matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g)
  @ApiProperty({
    example: 'password!@#',
    description: '변경을 희망하는 비밀번호',
    required: true,
  })
  changePassword: string;
}
