import { ApiProperty } from '@nestjs/swagger';

export class ExitUserVerifyDto {
  @ApiProperty({
    example: 'password!@#',
    description: '회원탈퇴 전 유저검증시 입력받는 기존 비밀번호',
    required: true,
  })
  password: string;
}
