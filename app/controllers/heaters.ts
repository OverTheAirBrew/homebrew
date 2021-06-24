import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

import { Service } from 'typedi';

import { HeaterService } from '../lib/peripherals/heaters';

import { IHeater } from '../lib/peripherals/models';

@JsonController()
@Service()
export class HeaterController {
  constructor(private heaterService: HeaterService) {}

  @Post('/heaters')
  @HttpCode(201)
  async createHeater(@Body() body: IHeater) {
    const id = await this.heaterService.createHeater(body);
    return {
      id,
    };
  }

  @Get('/heaters')
  async getHeaters() {
    const heaters = await this.heaterService.getHeaters();
    return heaters;
  }

  @Get('/heaters/:id')
  async getHeater(@Param('id') id: string) {
    const heater = await this.heaterService.getHeaterById(id);
    return heater;
  }
}
