import { Logic } from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { LogicTypeDto } from '../../models/dto/logic-type-dto';
import { PropertyMapper } from '../property-mapper';

@Service()
export class LogicTypesService {
  constructor(
    @InjectMany('logic') private logic: Logic[],
    private propertyMapper: PropertyMapper,
  ) {}

  public async getLogicTypes() {
    return await Promise.all(
      this.logic.map((logic) => this.mapLogicType(logic)),
    );
  }

  public async mapLogicType(logic: Logic) {
    const mappedProperties = await Promise.all(
      logic.properties.map((p) => this.propertyMapper.map(p)),
    );

    return new LogicTypeDto(logic.logicName, mappedProperties);
  }
}
