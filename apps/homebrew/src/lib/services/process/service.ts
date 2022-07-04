import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILockingClient } from '@ota-internal/locking';
import { ProcessKettleLogic } from '../../../models/events/process-kettle-logic';
import { ActorTypesService } from '../actor-types/service';
import { DeviceService } from '../device/service';
import { KettleService } from '../kettle/service';
import { LogicTypesService } from '../logic-types/service';

@Injectable()
export class ProcessService {
  constructor(
    private kettleService: KettleService,
    private logicService: LogicTypesService,
    private actorTypeService: ActorTypesService,
    private deviceService: DeviceService,
    private eventEmitter: EventEmitter2,
    private lockService: ILockingClient,
  ) {}

  public async processKettleLogic<T>(
    kettle_id: string,
    logicType_id: string,
    config: T,
    run_id: string,
  ) {
    const { unlock } = await this.lockService.lock(
      `process-kettle:${kettle_id}`,
      10000,
    );

    try {
      const kettle = await this.kettleService.getRawKettleWithInclusions(
        kettle_id,
      );

      if (!kettle.targetTemperature) {
        await this.kettleService.toggleKettleWorking(kettle_id);
        return;
      }

      if (!kettle.logicRun_id || kettle.logicRun_id !== run_id) return;

      const logicType = await this.logicService.getRawLogicTypeById(
        logicType_id,
      );

      const deviceType = await this.deviceService.getDeviceById(
        kettle.heater.device_id,
      );

      const actorType = await this.actorTypeService.getRawActorTypeById(
        deviceType.type_id,
        kettle.heater.type_id,
      );

      const { heatTime, waitTime, nextParams } = await logicType.run(
        config,
        kettle.sensor.telemetries[0].reading,
        kettle.targetTemperature,
      );

      // await actorType.on(actor.id, actor.config);
      await new Promise((resolve) => setTimeout(resolve, heatTime));
      // await actorType.off(actor.id, actor.config);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      this.eventEmitter.emit(
        ProcessKettleLogic.Channel,
        new ProcessKettleLogic(kettle_id, logicType_id, nextParams, run_id),
      );
    } finally {
      if (unlock) await unlock();
    }
  }
}
