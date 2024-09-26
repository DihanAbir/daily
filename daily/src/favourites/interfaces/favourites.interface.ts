import { IBase, IPaginate } from '../../common/interfaces';

export interface IFavourite extends IBase {
  readonly _id?: string;
  readonly user?: string;
  readonly product?: string;
  readonly isFavourite?: boolean;
}

export interface IFavourites extends IPaginate {
  data: IFavourite[];
}
