import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IThread } from '../../interfaces';
import { ThreadDto } from './thread.dto';

export class CreateThreadDto
  extends OmitType(ThreadDto, [
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<CreateThreadDto>
{
  @ApiProperty()
  message: string;
  constructor(data) {
    super(data);
    if (data) {
      data.message && (this.message = data.message);
    }
  }
}
