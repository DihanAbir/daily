import { IBase } from '../../common/interfaces'

export interface ISize extends IBase {
    readonly _id?: string;
    readonly category?: string;
    readonly region?: string;
    readonly size?: string;
    readonly description?: string;
}
