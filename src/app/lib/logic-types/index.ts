import { InjectMany, Service } from 'typedi';
import { LogicTypeDto } from '../../models/dto/logic-types-dto';
import { InvalidLogicTypeError } from '../errors/invalid-logic-type';
import { LOGIC_TOKEN } from '../plugin';
import { Logic as LogicType } from '../plugin/abstractions/logic';
import { PropertyMapper } from '../property-mapper';

@Service()
export class LogicTypesService {
  constructor(
    @InjectMany(LOGIC_TOKEN) private logics: LogicType<any>[],
    private propertyMapper: PropertyMapper,
  ) {}

  public async getLogicTypes() {
    return await Promise.all(
      this.logics.map((logic) => this.mapLogicTypes(logic)),
    );
  }

  public async getRawLogicTypeById(id: string) {
    const logicType = this.logics.find((s) => s.name === id);

    if (!logicType) {
      throw new InvalidLogicTypeError(id);
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

  private async mapLogicTypes(logic: LogicType<any>) {
    const mappedProperties = await Promise.all(
      logic.properties.map((p) => this.propertyMapper.map(logic.name, p)),
    );

    return new LogicTypeDto(logic.name, mappedProperties);
  }
}
