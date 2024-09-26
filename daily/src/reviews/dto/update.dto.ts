import { OmitType } from '@nestjs/swagger';
import { ReviewDto } from './review.dto';
import { IReview } from '../interfaces/review.interface';

export class UpdateReviewDto
  extends OmitType(ReviewDto, [
    'reviewer',
    'user',
    'product',
    'rent',
    'ratings',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<UpdateReviewDto>
{
  constructor(data?: IReview) {
    super(data);
  }
}
