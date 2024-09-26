import { ApiProperty } from '@nestjs/swagger';

export class UpdateCityDto implements Readonly<UpdateCityDto> {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty({ default: false })
  isCapital: boolean;

  @ApiProperty({ default: false })
  isStateCapital: boolean;
}
