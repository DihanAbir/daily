import { IPaginate } from '../../common/interfaces/paginate.interface';
import { ISize } from './size.interface';

export interface ISizes extends IPaginate {
  data: ISize[];
}
