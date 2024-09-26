import { ICountry } from './country.interface';
import { IState } from './state.interface';

export interface ICity {
  readonly _id: string;
  readonly name: string;
  readonly areaCode: string;
  readonly lat: number;
  readonly lng: number;
  readonly state: IState;
  readonly country: ICountry;
  readonly isCapital: boolean;
  readonly isStateCapital: boolean;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
