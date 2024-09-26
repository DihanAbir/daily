import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CountrySchema } from './schemas/country.schema';
import { StateSchema } from './schemas/state.schema';
import { CitySchema } from './schemas/city.schema';
import { CountryService, StateService } from './services';
import { CountryController, StateController } from './controllers';
import { CityService } from './services';
import { CityController } from './controllers/city.controller';
import { SCHEMA } from '../common/mock';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SCHEMA.COUNTRY, schema: CountrySchema },
      { name: SCHEMA.STATE, schema: StateSchema },
      { name: SCHEMA.CITY, schema: CitySchema },
    ]),
    HttpModule,
  ],
  controllers: [CountryController, StateController, CityController],
  providers: [CountryService, StateService, CityService],
})
export class DemographyModule {}
