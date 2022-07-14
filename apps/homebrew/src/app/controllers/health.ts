import { All, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @All('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async healthCheck() {
    // We should populate something in here to make sure the service is running
    return {};
  }
}
