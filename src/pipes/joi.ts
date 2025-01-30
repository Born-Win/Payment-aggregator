import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    const valueToValidate = type ? { [type]: value } : value;
    const { error, value: transformedValue } =
      this.schema.validate(valueToValidate);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return type ? transformedValue[type] : transformedValue;
  }
}
