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
export class AuthValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);

    const errors = await validate(object);
    if (errors.length) {
      const error = errors[0];
      const constraints = error.constraints;

      /** isNNN 에 담긴 message값 추출 */
      const message = Object.values(constraints)[0];

      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        description: message,
        action: {
          parameter: error.property !== 'password' ? error.value : '',
          message: 'invalid_' + error.property,
        },
      });
    }
    return value;
  }
}
