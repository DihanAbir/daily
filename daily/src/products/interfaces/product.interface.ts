import { IBase, IMedia } from '../../common/interfaces';
import { IFavourite } from '../../favourites/interfaces';

export interface IProduct extends IBase {
  readonly _id?: string;
  readonly owner?: string;
  readonly category?: string;
  readonly collections?: string[];
  readonly size?: string;
  readonly color?: string;
  readonly brand?: string;
  readonly title?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly status?: string;
  readonly base64Image?: string[];
  readonly images?: [IMedia];
  readonly videos?: [IMedia];
  readonly retailPrice?: number;
  readonly rentPerDayPrice?: number;
  readonly minimalRentalPeriodInDays?: number;
  readonly cleaningPrice?: number;
  readonly viewCount?: number;
  readonly ratings?: number;
  readonly postage?: string;
  isFavourite?: boolean;
  favourites?: [IFavourite];

}
