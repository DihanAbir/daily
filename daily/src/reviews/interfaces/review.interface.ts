import { IBase, IMedia } from '../../common/interfaces';

export interface IReview extends IBase {
  readonly title?: string;
  readonly slug?: string;
  readonly reviewer?: string;
  readonly user: string;
  readonly product: string;
  readonly rent?: string;
  readonly review?: string;
  readonly reply?: string;
  readonly ratings?: number;
  readonly pictures?: IMedia[];
  readonly helpfulCount?: number;
}
