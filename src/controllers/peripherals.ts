import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { Service } from 'typedi';
import { PeripheralDto } from '../lib/models/peripheral';
import { IdResponse } from '../lib/models/id-response';

import { PeripheralService } from '../lib/peripherals/index.ts';

import { Peripheral } from '../lib/models/peripheral';

@JsonController()
@Service()
export class PeripheralsController {
  constructor(private peripheralService: PeripheralService) {}

  @Post('/peripherals')
  @HttpCode(201)
  @ResponseSchema(IdResponse)
  async createHeater(@Body() body: Peripheral): Promise<{ id: string }> {
    const id = await this.peripheralService.createPeripheral({
      ...body,
    });
    return {
      id,
    };
  }

  @Get('/peripherals')
  @ResponseSchema(PeripheralDto, { isArray: true })
  async getHeaters() {
    const heaters = await this.peripheralService.getPeripherals();
    return heaters;
  }

  @Get('/peripherals/:id')
  @ResponseSchema(PeripheralDto)
  async getHeater(@Param('id') id: string) {
    const heater = await this.peripheralService.getPeripheralById(id);
    return heater;
  }
}
