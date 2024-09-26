import { IBase } from '../../common/interfaces'

export interface IColor extends IBase {
    readonly _id?: string;
    readonly name?: string;
    readonly code?: string;
}
