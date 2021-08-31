import { InjectMany, Service } from 'typedi';
import {
  LogicToken,
  Logic as LogicType,
} from '@overtheairbrew/homebrew-plugin';
import { LogicTypeDto } from '../models/logic-type-dto';

@Service()
export class LogicTypeService {
  constructor(@InjectMany(LogicToken) private logics: LogicType[]) {}

  public async getLogicTypes() {
    const logicTypes = this.logics.map(
      (logic) => new LogicTypeDto(logic.logicName, logic.properties),
    );
    return [...logicTypes];
  }
}
