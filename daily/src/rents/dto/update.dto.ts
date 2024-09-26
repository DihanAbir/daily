import { OmitType } from '@nestjs/swagger';
import { RentDto } from './rent.dto';
import { IRent } from '../interfaces';

export class UpdateRentDto
    extends OmitType(RentDto, [
        'product',
        'owner',
        'customer',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateRentDto> {
    constructor(data?: IRent) {
        super(data);
    }
}
