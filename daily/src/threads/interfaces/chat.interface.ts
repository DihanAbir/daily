import { IBase, IMedia } from '../../common/interfaces';

export interface IChat extends IBase {
  readonly _id?: string;
  readonly thread?: string;
  message?: string;
  readonly files?: IMedia[];
  readonly sender?: string;
  readonly receiver?: string;
  readonly isRead?: boolean;
}
