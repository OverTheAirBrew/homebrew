import { SequelizeStorage, Umzug } from 'umzug';
import { Sequelize } from 'sequelize';
import { Logger } from '../lib/logger';

export class ProgramaticMigate {
  private readonly umzug: Umzug;

  constructor(private connection: Sequelize, logger: Logger) {
    this.umzug = new Umzug({
      migrations: { glob: '**/package/orm/migrations/*.js' },
      context: this.connection.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.connection }),
      logger: {
        debug: (msg) => logger.debug(JSON.stringify(msg)),
        error: (msg) => logger.error(new Error(JSON.stringify(msg))),
        info: (msg) => {
          logger.info(JSON.stringify(msg));
        },
        warn: (msg) => logger.warn(JSON.stringify(msg)),
      },
    });
  }

  public async up() {
    const output = await this.umzug.up();
  }

  public async down() {
    await this.umzug.down();
  }
}