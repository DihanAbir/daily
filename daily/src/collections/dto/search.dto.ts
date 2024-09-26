import { SearchQueryDto } from '../../common/dto';

export class SearchCollectionDto
    extends SearchQueryDto
    implements Readonly<SearchCollectionDto>
{}
