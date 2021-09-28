import { Logger } from '../../../src/lib/logger';
import { ProgramaticMigate } from '../../../src/orm/programatic-migrate';
import { SequelizeWrapper } from '../../../src/orm/sequelize-wrapper';

Promise.resolve()
  .then(async () => {
    const wrapper = new SequelizeWrapper({
      dialect: 'mysql',
      url: 'mysql://root:@localhost/homebrew',
    });

    const logger = new Logger({
      level: 'info',
      node_env: 'testing',
      serviceName: 'tests',
    });

    const migrator = new ProgramaticMigate(wrapper.sequelize as any, logger);

    await migrator.up();
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
