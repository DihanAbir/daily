import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IColor } from './color.interface';

export interface IColors extends IPaginate {
  data: IColor[];
}
