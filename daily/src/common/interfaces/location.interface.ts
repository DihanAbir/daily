import { ICity } from '../../demography/interfaces/city.interface';
import { ICountry } from '../../demography/interfaces/country.interface';
import { IState } from '../../demography/interfaces/state.interface';

export interface ILocation {
  readonly _id: string;
  readonly address: string;
  readonly city: ICity;
  readonly state: IState;
  readonly country: ICountry;
  readonly zipCode: string;
  readonly lat: number;
  readonly lng: number;
  readonly isCurrent: boolean;
  readonly isPermanent: boolean;
  readonly isDeleted: boolean;
}
