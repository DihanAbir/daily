import {
  IsArray,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Continent } from '../../../common/mock/constant.mock';
import { Type } from 'class-transformer';

export class ExtObjDto implements Readonly<ExtObjDto> {
  @ApiProperty()
  @MaxLength(2)
  @MinLength(10)
  @IsString()
  iso2code: string;

  @ApiProperty()
  value: string;
}

export class CountryDto implements Readonly<CountryDto> {
  @ApiProperty()
  @MaxLength(80)
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty()
  @MaxLength(2)
  @MinLength(10)
  @IsString()
  iso2code: string;

  @ApiProperty({
    type: ExtObjDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ExtObjDto)
  region: ExtObjDto;

  @ApiProperty({
    type: ExtObjDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ExtObjDto)
  incomeLevel: ExtObjDto;

  @ApiProperty()
  dialingCode: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  capitalCity: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  @IsArray()
  languages: [];

  @ApiProperty()
  @IsArray()
  timezones: [];

  @ApiProperty({ enum: Continent })
  @IsEnum(Continent)
  continent: Continent;

  @ApiProperty()
  flag: string;

  @ApiProperty()
  flagEmoji: string;

  @ApiProperty()
  emojiUnicode: string;

  @ApiProperty({ default: true })
  isActive: boolean;

  @ApiProperty({ default: false })
  isDeleted: boolean;

  @ApiProperty()
  cTime: number;

  @ApiProperty()
  cBy: string;

  @ApiProperty()
  uTime: number;

  @ApiProperty()
  uBy: string;

  @ApiProperty()
  dTime: number;

  @ApiProperty()
  dBy: string;
}
