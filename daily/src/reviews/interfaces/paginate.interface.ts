import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IReview } from './review.interface';

export interface IReviews extends IPaginate {
  data: IReview[];
}
