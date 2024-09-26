import { IPaginate } from '../../common/interfaces/paginate.interface';
import { ICollection } from './collection.interface';

export interface ICollections extends IPaginate {
  data: ICollection[];
}
