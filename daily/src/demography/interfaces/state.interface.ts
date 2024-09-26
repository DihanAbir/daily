import { ICity } from './city.interface';
import { ICountry } from './country.interface';

export interface IState {
  readonly _id: string;
  readonly name: string;
  readonly iso2code: string;
  readonly lat: number;
  readonly lng: number;
  readonly cities: ICity[];
  readonly country: ICountry;
  readonly isCapital: boolean;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
