import { IBase, ILocation } from '../../common/interfaces';

export interface IRent extends IBase {
    readonly _id?: string;
    readonly product?: string;
    readonly owner?: string;
    readonly customer?: string;
    readonly location?: ILocation;
    readonly rentFromDate?: number;
    readonly rentToDate?: number;
    readonly price?: number;
    readonly priceBreakdown?: Record<string, any>; // Define as Record<string, any> for JSON object
    readonly status?: string;
    readonly paymentStatus?: string;
    readonly notesForOwner?: string;
    readonly deliveryMethod?: string;
}
