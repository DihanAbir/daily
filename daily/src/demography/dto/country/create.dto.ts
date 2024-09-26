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
import { ExtObjDto } from './country.dto';

export class CreateCountryDto implements Readonly<CreateCountryDto> {
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
  timezones: Array<any>;

  @ApiProperty({ enum: Continent })
  @IsEnum(Continent)
  continent: Continent;

  @ApiProperty()
  flag: string;

  @ApiProperty()
  flagEmoji: string;

  @ApiProperty()
  emojiUnicode: string;
}
