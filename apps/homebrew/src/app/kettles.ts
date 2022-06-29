import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KettleService } from '../lib/services/kettle/service';
import { IdResponseDto } from '../models/dto/id-response.dto';
import { KettleDto } from '../models/dto/kettle.dto';

@ApiTags('kettles')
@Controller('kettles')
export class KettleController {
  constructor(private service: KettleService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
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

    return new IdResponseDto(kettle_id);
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

  @Get('/:kettleId')
  @ApiResponse({
    type: KettleDto,
  })
  async getKettle(@Param('kettleId') kettleId: string) {
    return await this.service.getKettleById(kettleId);
  }

  @Put('/:kettleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async updateKettle(
    @Body() kettle: KettleDto,
    @Param('kettleId') kettleId: string,
  ) {
    await this.service.updateKettle(kettleId, kettle);
  }

  @Patch('/:kettleId/working')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async toggleKettleWorking(@Param('kettleId') kettleId: string) {
    await this.service.toggleKettleWorking(kettleId);
  }
}
