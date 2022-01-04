import { homedir } from 'os';
import { join } from 'path';
import { ConnectionOptions, createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

const DEFAULT_DATABASE_LOCATION = join(
  homedir(),
  'overtheairbrew',
  'database.db',
);

const DATABASE_CONFIG = async (
  entities: string[],
): Promise<ConnectionOptions> => {
  const {
    DATABASE_ENGINE = 'disk',
    DATABASE_CONNECTION_STRING = DEFAULT_DATABASE_LOCATION,
  } = process.env;

  const baseConfig = {
    entities,
    synchronize: true,
  };

  if (DATABASE_ENGINE === 'disk') {
    return {
      ...baseConfig,
      type: 'sqlite',
      database: DATABASE_CONNECTION_STRING,
    };
  }

  if (DATABASE_ENGINE === 'mysql') {
    if (await isValidUrl(DATABASE_CONNECTION_STRING)) {
      return {
        type: 'mysql',
        url: DATABASE_CONNECTION_STRING,
        database: 'overtheair',
        ...baseConfig,
      };
    } else {
      throw new Error('Invalid database connection string');
    }
  }
};

async function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export async function startDatabaseConnection() {
  useContainer(Container);

  const config = await DATABASE_CONFIG([join(__dirname, 'models', '*.js')]);
  return await createConnection(config);
}
