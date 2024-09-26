export interface IWallet {
  readonly _id: string;
  readonly points: number;
  readonly balance: number;
  readonly currency: string;
  readonly isDeleted: boolean;
}
