import { OmitType } from '@nestjs/swagger';
import { IFavourite } from '../interfaces';
import { FavouriteDto } from './favourites.dto';

export class CreateFavouriteDto
  extends OmitType(FavouriteDto, [
    'user',
    'isFavourite',
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<CreateFavouriteDto>
{
  constructor(data?: IFavourite) {
    super(data);
  }
}
