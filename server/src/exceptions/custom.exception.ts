import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  /**
   * @param status - HTTP 상태코드
   * @param descrption - 에러의 설명
   * @param parameter - 에러가 발생한 값
   * @param message - 에러 메세지
   */
  constructor(
    status: number,
    description: string,
    parameter: string,
    message: string,
  ) {
    const response = {
      status,
      description,
      action: {
        parameter,
        message,
      },
    };

    super(response, status);
  }
}
