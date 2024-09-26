import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStateDto implements Readonly<CreateStateDto> {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  iso2code: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  @IsMongoId()
  country: string;

  @ApiProperty({ default: false })
  isCapital: boolean;
}
