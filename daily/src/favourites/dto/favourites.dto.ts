import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto';
import { IFavourite } from '../interfaces';

export class FavouriteDto extends BaseDto implements Readonly<FavouriteDto> {
  @ApiProperty()
  @IsMongoId()
  user: string;

  @ApiProperty()
  @IsMongoId()
  product: string;

  @ApiProperty()
  isFavourite: boolean;

  constructor(data?: IFavourite) {
    super(data);
    if (data) {
      data.user && (this.user = data.user);
      data.product && (this.product = data.product);
      data.hasOwnProperty('isFavourite') &&
        (this.isFavourite = data.isFavourite);
    }
  }
}
