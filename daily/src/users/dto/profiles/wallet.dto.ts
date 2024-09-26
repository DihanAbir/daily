import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Currency } from '../../../common/mock';

export class WalletDto implements Readonly<WalletDto> {
  @ApiProperty()
  points: number;

  @ApiProperty()
  balance: number;

  @ApiProperty({ enum: Currency })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty()
  isDeleted: boolean;
}
