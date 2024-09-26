import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DemographicDTO implements Readonly<DemographicDTO> {
  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsMongoId()
  cityId: string;

  @ApiProperty()
  @IsMongoId()
  stateId: string;
}
