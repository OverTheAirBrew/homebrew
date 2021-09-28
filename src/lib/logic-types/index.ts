import {
  Logic as LogicType,
  LogicToken,
} from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { PropertyTypeMapper } from '../mappers/property-mapper';
import { LogicTypeDto } from '../models/logic-type-dto';

@Service()
export class LogicTypeService {
  constructor(
    @InjectMany(LogicToken) private logics: LogicType[],
    public propMapper: PropertyTypeMapper,
  ) {}

  public async getLogicTypes() {
    const logicTypes = await Promise.all(
      this.logics.map(async (logic) => {
        const properties = await Promise.all(
          logic.properties.map(this.propMapper.map),
        );
        return new LogicTypeDto(logic.logicName, properties);
      }),
    );
    return [...logicTypes];
  }
}
