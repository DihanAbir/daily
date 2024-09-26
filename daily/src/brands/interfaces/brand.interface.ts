import { IBase, IMedia } from '../../common/interfaces'

export interface IBrand extends IBase {
    readonly _id?: string;
    readonly name?: string;
    readonly description?: string;
    readonly image?: IMedia;
    readonly isApproved?: boolean;

}
