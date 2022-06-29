import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceService } from '../lib/services/device/service';
import { DeviceDto } from '../models/dto/device.dto';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
  constructor(private service: DeviceService) {}

  @Get('/')
  @ApiResponse({
    type: DeviceDto,
    isArray: true,
  })
  async get() {
    return await this.service.getAllDevices();
  }
}
