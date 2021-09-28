import { ILogger } from '@overtheairbrew/homebrew-plugin';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

export class ProgramaticMigate {
  private readonly umzug: Umzug;

  constructor(private connection: Sequelize, logger: ILogger) {
    this.umzug = new Umzug({
      migrations: { glob: '**/migrations/*.js' },
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
    const migratedFiles = await this.umzug.up();
    return migratedFiles.map((file) => file.name);
  }

  public async down() {
    await this.umzug.down();
  }
}
