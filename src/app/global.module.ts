import { Module, Global } from '@nestjs/common';
import { Storage } from '../database/storage';

@Global()
@Module({
  providers: [Storage],
  exports: [Storage],
})
export class GlobalModule {}
