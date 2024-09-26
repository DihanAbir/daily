import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCountryDto implements Readonly<UpdateCountryDto> {
  @ApiProperty()
  dialingCode: string;

  @ApiProperty()
  @IsArray()
  languages: [];
}
