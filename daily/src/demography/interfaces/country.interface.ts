import { State } from '../schemas/state.schema';

interface extObj {
  readonly _id: string;
  readonly iso2Code: string;
  readonly value: string;
}

export interface ICountry {
  readonly _id: string;
  readonly name: string;
  readonly iso2code: string;
  readonly region: extObj;
  readonly incomeLevel: extObj;
  readonly capitalCity: string;
  readonly lat: number;
  readonly lng: number;
  readonly languages: string[];
  readonly timezones: string[];
  readonly dialingCode: string;
  readonly currency: string;
  readonly states: State[];
  readonly continent: string;
  readonly flag: string;
  readonly flagEmoji: string;
  readonly emojiUnicode: string;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
