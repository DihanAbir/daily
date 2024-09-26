import { OmitType } from '@nestjs/swagger';
import { IChat } from '../../interfaces';
import { ChatDto } from './chat.dto';

export class CreateChatDto
  extends OmitType(ChatDto, [
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<CreateChatDto>
{
  constructor(data?: IChat) {
    super(data);
    if (data) {
      data.thread && (this.thread = data.thread);
      data.message && (this.message = data.message);
      data.files && (this.files = data.files);
      data.sender && (this.sender = data.sender);
      data.receiver && (this.receiver = data.receiver);
    }
  }
}
