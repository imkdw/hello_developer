import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @Length(2, 8)
  @Matches(/^[^{}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]*$/)
  @ApiProperty({
    example: '변경닉네임',
    description: '변경을 희망하는 닉네임',
    required: true,
  })
  nickname: string;

  @Length(0, 30)
  @ApiProperty({
    example: '변경자기소개',
    description: '변경을 희망하는 자기소개',
    required: true,
  })
  introduce: string;
}
