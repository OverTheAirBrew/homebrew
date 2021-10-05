import { ILogger } from '@overtheairbrew/homebrew-plugin';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

export class ProgramaticMigate {
  constructor(private connection: Sequelize, private logger: ILogger) {}

  private async getConnection() {
    return new Umzug({
      migrations: { glob: '**/migrations/*.js' },
      context: this.connection.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.connection }),
      logger: {
        debug: (msg) => this.logger.debug(JSON.stringify(msg)),
        error: (msg) => this.logger.error(new Error(JSON.stringify(msg))),
        info: (msg) => {
          this.logger.info(JSON.stringify(msg));
        },
        warn: (msg) => this.logger.warn(JSON.stringify(msg)),
      },
    });
  }

  public async up() {
    const umzug = await this.getConnection();

    const migratedFiles = await umzug.up();
    return migratedFiles.map((file) => file.name);
  }

  public async down() {
    const umzug = await this.getConnection();
    await umzug.down();
  }
}
