import { stubConstructor } from 'ts-sinon';
import { SequelizeWrapper } from '../../../../src/orm/sequelize-wrapper';

export const sequelizeWrapperStub = stubConstructor(SequelizeWrapper, {
  dialect: 'sqlite',
  storage: '',
});
