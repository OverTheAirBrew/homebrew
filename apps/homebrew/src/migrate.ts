import { migrateDatabase, sequelize } from './database/provider';

Promise.resolve()
  .then(async () => {
    await migrateDatabase(sequelize);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
