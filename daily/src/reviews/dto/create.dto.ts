import { OmitType } from '@nestjs/swagger';
import { IReview } from '../interfaces/review.interface';
import { ReviewDto } from './review.dto';

export class CreateReviewDto
  extends OmitType(ReviewDto, [
    'slug',
    'pictures',
    'reviewer',
    'reply',
    'helpfulCount',
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<CreateReviewDto>
{
  constructor(data?: IReview) {
    super(data);
  }
}
