import { Body, Get, HttpCode, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { KettleService } from '../lib/kettle';
import { Kettle } from '../models/controller/kettle';

@JsonController('/kettles')
@Service()
export class KettleController {
  constructor(private kettleService: KettleService) {}

  @Post('/')
  @HttpCode(201)
  async createKettle(@Body() kettle: Kettle) {
    return await this.kettleService.createKettle(kettle);
  }

  @Get('/')
  async getKettles() {
    return await this.kettleService.getKettles();
  }
}
