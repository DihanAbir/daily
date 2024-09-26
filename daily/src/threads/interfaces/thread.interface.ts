import { IBase } from '../../common/interfaces';
import { IChat } from './chat.interface';

export interface IThread extends IBase {
  readonly _id?: string;
  readonly product?: string;
  readonly userOne?: string;
  readonly userTwo?: string;
  readonly isUserOneRead?: boolean;
  readonly isUserTwoRead?: boolean;
  readonly isUserOneOnline?: boolean;
  readonly isUserTwoOnline?: boolean;
  chats?: IChat[];
}
