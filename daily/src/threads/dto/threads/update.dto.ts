import { OmitType } from '@nestjs/swagger';
import { IThread } from '../../interfaces';
import { ThreadDto } from './thread.dto';

export class UpdateThreadDto
  extends OmitType(ThreadDto, [
    'product',
    'userOne',
    'userTwo',
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<UpdateThreadDto>
{
  constructor(data?: IThread) {
    super(data);
  }
}
