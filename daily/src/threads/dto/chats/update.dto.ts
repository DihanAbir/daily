import { OmitType } from '@nestjs/swagger';
import { IChat } from '../../interfaces';
import { ChatDto } from './chat.dto';

export class UpdateChatDto
  extends OmitType(ChatDto, [
    'thread',
    'sender',
    'receiver',
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<UpdateChatDto>
{
  constructor(data?: IChat) {
    super(data);
  }
}
