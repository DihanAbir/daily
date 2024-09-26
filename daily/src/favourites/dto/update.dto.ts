import { OmitType } from '@nestjs/swagger';
import { IFavourite } from '../interfaces';
import { FavouriteDto } from './favourites.dto';

export class UpdateFavouriteDto
  extends OmitType(FavouriteDto, [
    'user',
    'product',
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<UpdateFavouriteDto>
{
  constructor(data?: IFavourite) {
    super(data);
  }
}
