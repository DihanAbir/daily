import { IBase } from "../../common/interfaces";

export interface INotification extends IBase {
    readonly _id?: string;
    readonly sender?: string;
    readonly receiver?: string;
    readonly product?: string;
    readonly rent?: string;
    readonly subject?: string;
    readonly text?: string;
    readonly activityType?: string;
    readonly activityName?: string;
    readonly actionInfo?: Record<string, unknown>;
    readonly isRead?: boolean;
}

export interface INotificationWithCount {
    readonly notifications: INotification[];
    readonly unreadCount: number;
}

