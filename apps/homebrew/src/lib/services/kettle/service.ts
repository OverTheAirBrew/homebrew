import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { Kettle } from '../../../database/models/kettle';
import { KettleRepository } from '../../../lib/constants';
import { KettleNotFoundError } from '../../../lib/errors/kettle-not-found-error';
import { nullIfEmpty } from '../../../lib/utils';
import { KettleDto } from '../../../models/dto/kettle.dto';
import { ProcessKettleLogic } from '../../../models/events/process-kettle-logic';
import { KettleInIncorrectStateToWork } from '../../errors/kettle-in-incorrect-state-to-work';

@Injectable()
export class KettleService {
  constructor(
    @Inject(KettleRepository) private repository: typeof Kettle,
    private eventEmitter: EventEmitter2,
  ) {}

  async createKettle(
    name: string,
    sensor_id?: string,
    heater_id?: string,
    logicType_id?: string,
    config?: any,
  ) {
    const kettle = await this.repository.create({
      name,
      sensor_id: await nullIfEmpty(sensor_id),
      heater_id: await nullIfEmpty(heater_id),
      logicType_id: await nullIfEmpty(logicType_id),
      config: await nullIfEmpty(config),
    });

    return kettle.id;
  }

  async getKettles() {
    const kettles = await this.repository.findAll();

    return await Promise.all(kettles.map(this.mapKettle));
  }

  async getKettleById(kettle_id: string) {
    const kettle = await this.repository.findByPk(kettle_id);
    if (!kettle) {
      throw new KettleNotFoundError(kettle_id);
    }

    return await this.mapKettle(kettle);
  }

  async updateKettle(id: string, kettle: KettleDto) {
    const currentKettle = await this.repository.findByPk(id);

    if (!currentKettle) {
      throw new KettleNotFoundError(id);
    }

    currentKettle.update({
      name: kettle.name,
      sensor_id: await nullIfEmpty(kettle.sensor_id),
      heater_id: await nullIfEmpty(kettle.heater_id),
      logicType_id: await nullIfEmpty(kettle.logicType_id),
      config: await nullIfEmpty(kettle.config),
    });

    await currentKettle.save();
  }

  async toggleKettleWorking(kettleId: string) {
    let kettle = await this.repository.findByPk(kettleId);

    if (!kettle) {
      throw new KettleNotFoundError(kettleId);
    }

    if (!kettle.sensor_id || !kettle.heater_id || !kettle.logicType_id) {
      throw new KettleInIncorrectStateToWork(kettleId);
    }

    kettle.update({
      logicRun_id: !!kettle.logicRun_id ? null : uuid(),
    });

    kettle = await kettle.save();

    if (!!kettle.logicRun_id) {
      this.eventEmitter.emit(
        ProcessKettleLogic.Channel,
        new ProcessKettleLogic(
          kettle.id,
          kettle.logicType_id,
          kettle.config,
          kettle.logicRun_id,
        ),
      );
    }
  }

  async getRunningKettles() {
    const kettles = await this.repository.findAll({
      where: {
        logicRun_id: {
          [Op.ne]: null,
        },
      },
    });

    return await Promise.all(kettles.map((kettle) => this.mapKettle(kettle)));
  }

  private async mapKettle(kettle: Kettle) {
    return new KettleDto(
      kettle.id,
      kettle.name,
      kettle.sensor_id,
      kettle.heater_id,
      kettle.logicType_id,
      kettle.targetTemperature,
      kettle.logicRun_id,
      kettle.config,
    );
  }
}
