import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CityDto implements Readonly<CityDto> {
  @ApiProperty()
  @MaxLength(80)
  @MinLength(1)
  @IsString()
  name: string;

  @ApiProperty()
  areaCode: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  @IsMongoId()
  state: string;

  @ApiProperty()
  @IsMongoId()
  country: string;

  @ApiProperty({ default: false })
  isCapital: boolean;

  @ApiProperty({ default: false })
  isStateCapital: boolean;

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
}
