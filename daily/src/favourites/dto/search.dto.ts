import { SearchQueryDto } from '../../common/dto';

export class SearchFavouriteDto
  extends SearchQueryDto
  implements Readonly<SearchFavouriteDto> {}
