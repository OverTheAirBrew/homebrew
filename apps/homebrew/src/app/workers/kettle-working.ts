import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProcessService } from '../../lib/services/process/service';
import { ProcessKettleLogic } from '../../models/events/process-kettle-logic';

@Injectable()
export class KettleWorkingService {
  constructor(private processService: ProcessService) {}

  @OnEvent(ProcessKettleLogic.Channel)
  async processKettleLogic(payload: ProcessKettleLogic<any>) {
    await this.processService.processKettleLogic(
      payload.kettle_id,
      payload.logicType,
      payload.config,
      payload.run_id,
    );
  }
}
