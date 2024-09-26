import { ApiProperty } from '@nestjs/swagger';

export class UpdateStateDto implements Readonly<UpdateStateDto> {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty({ default: false })
  isCapital: boolean;
}
