import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdResponseDto } from '../../models/dto/id-response.dto';
import { KettleDto } from '../../models/dto/kettle.dto';
import { KettleService } from './service';

@ApiTags('kettles')
@Controller('kettles')
export class KettleController {
  constructor(private service: KettleService) {}

  @Post('/')
  @ApiCreatedResponse({
    type: IdResponseDto,
  })
  async createKettle(@Body() kettle: KettleDto) {
    const kettle_id = await this.service.createKettle(
      kettle.name,
      kettle.sensor_id,
      kettle.heater_id,
      kettle.logicType_id,
      kettle.config,
    );

    return {
      id: kettle_id,
    };
  }

  @Get('/')
  @ApiOkResponse({
    type: KettleDto,
    isArray: true,
  })
  async getKettles() {
    const kettles = await this.service.getKettles();
    return kettles;
  }

  @Put('/:kettleId')
  @ApiNoContentResponse()
  async updateKettle(
    @Body() kettle: KettleDto,
    @Param('kettleId') kettleId: string,
  ) {
    await this.service.updateKettle(kettleId, kettle);
  }
}
