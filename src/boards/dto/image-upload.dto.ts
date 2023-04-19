import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadDto {
  @ApiProperty({
    example: 'string',
    description: '이미지 업로드를 위해 임시로 발급받는 게시글 아이디',
    required: true,
  })
  tempBoardId: string;
}
