import { SearchQueryDto } from '../../common/dto';

export class SearchNotificationDto
    extends SearchQueryDto
    implements Readonly<SearchNotificationDto>
{}
