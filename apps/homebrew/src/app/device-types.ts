import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('device-types')
@Controller('device-types')
export class DeviceTypesController {}
