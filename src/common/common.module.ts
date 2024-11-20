import { Global, Module } from '@nestjs/common';
import {v4} from 'uuid';
import constants from 'src/constants';

@Global()
@Module({
  providers: [{
    provide: constants.uuid,
    useValue: v4
  }],
  exports: [constants.uuid]
})
export class CommonModule {}