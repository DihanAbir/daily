import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IRent } from './rent.interface';

export interface IRents extends IPaginate {
  data: IRent[];
}
