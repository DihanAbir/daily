import { IsString, IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, MediaDto } from '../../../common/dto';
import { Type } from 'class-transformer';
import { IChat } from '../../interfaces';
import { IMedia } from '../../../common/interfaces';

export class ChatDto extends BaseDto implements Readonly<ChatDto> {
  @ApiProperty()
  @IsMongoId()
  thread: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({
    type: MediaDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  files: IMedia[];

  @ApiProperty()
  @IsMongoId()
  sender: string;

  @ApiProperty()
  @IsMongoId()
  receiver: string;

  @ApiProperty()
  isRead: boolean;

  constructor(data?: IChat) {
    super(data);
    if (data) {
      data.thread && (this.thread = data.thread);
      data.message && (this.message = data.message);
      data.files && (this.files = data.files);
      data.sender && (this.sender = data.sender);
      data.receiver && (this.receiver = data.receiver);
      data.hasOwnProperty('isActive') && (this.isActive = data.isActive);
      data.hasOwnProperty('isDeleted') && (this.isDeleted = data.isDeleted);
    }
  }
}
