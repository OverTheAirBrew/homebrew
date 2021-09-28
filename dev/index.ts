import { OtaHomebrewApp } from '../src/application';

Promise.resolve()
  .then(async () => {
    new OtaHomebrewApp({
      port: 9090,
      // database: {
      //   dialect: 'sqlite',
      //   storage: join(__dirname, 'database.db'),
      // },
      database: {
        dialect: 'mysql',
        url: 'mysql://root:@localhost:3306/homebrew',
      },
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
