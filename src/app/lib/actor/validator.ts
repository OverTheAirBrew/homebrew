import { Service } from 'typedi';
import { ActorTypesService } from '../actor-types';
import { BaseValidator } from '../base-validator';

@Service()
export class ActorValidator extends BaseValidator<{
  name: string;
  type_id: string;
  config: any;
}> {
  constructor(actorTypeService: ActorTypesService) {
    super();

    this.ruleFor('name').notNull().notEmpty();

    this.ruleFor('type_id').mustAsync(async (type_id) => {
      const actorType = await actorTypeService.getActorTypeById(type_id);
      return !!actorType;
    });

    this.ruleFor('config').mustAsync(async (config, { type_id }) => {
      return await actorTypeService.validateConfig(type_id, config);
    });
  }
}
