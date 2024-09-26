import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/dto';
import { IThread } from '../../interfaces';

export class ThreadDto extends BaseDto implements Readonly<ThreadDto> {
  @ApiProperty()
  @IsMongoId()
  product: string;

  @ApiProperty()
  @IsMongoId()
  userOne: string;

  @ApiProperty()
  @IsMongoId()
  userTwo: string;

  @ApiProperty()
  isUserOneRead: boolean;

  @ApiProperty()
  isUserTwoRead: boolean;

  @ApiProperty()
  isUserOneOnline: boolean;

  @ApiProperty()
  isUserTwoOnline: boolean;

  constructor(data?: IThread) {
    super(data);
    if (data) {
      data.product && (this.product = data.product);
      data.userOne && (this.userOne = data.userOne);
      data.userTwo && (this.userTwo = data.userTwo);
      data.isUserOneRead && (this.isUserOneRead = data.isUserOneRead);
      data.isUserTwoRead && (this.isUserTwoRead = data.isUserTwoRead);
      data.isUserOneOnline && (this.isUserOneOnline = data.isUserOneOnline);
      data.isUserTwoOnline && (this.isUserTwoOnline = data.isUserTwoOnline);
      data.hasOwnProperty('isActive') && (this.isActive = data.isActive);
      data.hasOwnProperty('isDeleted') && (this.isDeleted = data.isDeleted);
    }
  }
}
