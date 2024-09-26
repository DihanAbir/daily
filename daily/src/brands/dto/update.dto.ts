import { OmitType } from '@nestjs/swagger';
import { BrandDto } from './brand.dto';
import { IBrand } from '../interfaces';

export class UpdateBrandDto
    extends OmitType(BrandDto, [
        'cTime',
        'cBy',
        'uTime',
        'uBy'
    ] as const)
    implements Readonly<UpdateBrandDto> {
    constructor(data?: IBrand) {
        super(data);
    }
}
