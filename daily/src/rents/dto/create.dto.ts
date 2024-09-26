import { OmitType } from '@nestjs/swagger';
import { RentDto } from './rent.dto';
import { IRent } from '../interfaces';

export class CreateRentDto
    extends OmitType(RentDto, [
        'customer',
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateRentDto> {
    constructor(data?: IRent) {
        super(data);
    }
}
