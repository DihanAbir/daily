import { ICity, ICountry, IState } from '.';
import { IPaginate } from '../../common/interfaces';

export interface ICountries extends IPaginate {
  data: ICountry[];
}

export interface IStates extends IPaginate {
  data: IState[];
}

export interface ICities extends IPaginate {
  data: ICity[];
}
