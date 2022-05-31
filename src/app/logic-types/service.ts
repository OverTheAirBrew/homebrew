import { Inject, Injectable } from '@nestjs/common';
import { ILogics } from '../../lib/constants';
import { ILogic } from '../../lib/plugin/abstractions/logic';
import { PropertyMapper } from '../../lib/property-mapper';
import { LogicTypeDto } from '../../models/dto/logic-type.dto';

@Injectable()
export class LogicTypesService {
  constructor(
    @Inject(ILogics) private logicTypes: ILogic<any>[],
    private mapper: PropertyMapper,
  ) {}

  public async getLogicTypes() {
    return await Promise.all(
      this.logicTypes.map((logic) => this.mapLogicTypes(logic)),
    );
  }

  public async getRawLogicTypeById(id: string) {
    const logicType = this.logicTypes.find((s) => s.name === id);

    if (!logicType) {
      throw new Error('invalid logic type');
    }

    return logicType;
  }

  public async getLogicTypeById(id: string) {
    const logic = await this.getRawLogicTypeById(id);
    return await this.mapLogicTypes(logic);
  }

  public async validateConfig(type_id: string, config: any) {
    const actorType = await this.getRawLogicTypeById(type_id);
    return await actorType.validate(config);
  }

  private async mapLogicTypes(logic: ILogic<any>) {
    const mappedProperties = await Promise.all(
      logic.properties.map((p) => this.mapper.map(logic.name, p)),
    );

    return new LogicTypeDto(logic.name, mappedProperties);
  }
}
