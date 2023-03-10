import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BoardValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length) {
      const error = errors[0];
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'invalid_' + error.property,
        error: 'Bad Request',
      });
    }

    return value;
  }
}
