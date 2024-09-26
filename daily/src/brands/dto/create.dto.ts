import { OmitType } from '@nestjs/swagger';
import { BrandDto } from './brand.dto';
import { IBrand } from '../interfaces';

export class CreateBrandDto
    extends OmitType(BrandDto, [
        'isActive',
        'isDeleted',
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<CreateBrandDto> {
    constructor(data?: IBrand) {
        super(data);
    }
}
