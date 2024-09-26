import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IBrand } from './brand.interface';

export interface IBrands extends IPaginate {
  data: IBrand[];
}
