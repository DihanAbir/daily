import { IsString, MaxLength, MinLength, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto implements Readonly<CreateCityDto> {
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
}
