import { join } from 'path';
import {
  useExpressServer,
  useContainer,
  getMetadataArgsStorage,
} from 'routing-controllers';
import 'reflect-metadata';
require('express-async-errors');
import { exec } from 'child_process';
import * as express from 'express';
import { Container } from 'typedi';
import { json } from 'body-parser';

import {
  init,
  SPEC_OUTPUT_FILE_BEHAVIOR,
  handleRequests,
  handleResponses,
} from 'express-oas-generator';

interface IOptions {
  port: number;
}

export class OtaHomebrewApp {
  private readonly baseControllerPath: string = join(
    __dirname,
    'controllers',
    '**',
    '*.js',
  );

  public readonly expressApp: express.Express;

  constructor(private options: IOptions) {
    this.expressApp = express();

    const ready = new Promise(async (resolve, reject) => {
      try {
        useContainer(Container);

        await this.serveDocs();

        await this.runMigrations();
        await this.loadAllServerControllers();
      } catch (err) {
        reject(err);
      }
    });

    ready.then(() => {
      this.expressApp.listen(this.options.port);
    });
  }

  private async serveDocs() {
    // const metadata = getMetadataArgsStorage();
    // const spec = routingControllersToSpec(metadata);

    const path = join(__dirname, 'docs.json');
    // writeFileSync(path, JSON.stringify(spec));

    init(
      this.expressApp,
      function (spec) {
        spec.info.title = 'OverTheAir Homebrew';

        return spec;
      },
      path,
      60 * 1000,
      'server/docs',
      [],
      [],
      [],
      true,
      SPEC_OUTPUT_FILE_BEHAVIOR.RECREATE,
    );
    const a = 1;

    // this.expressApp.use('/server/docs', swagger.serve, swagger.serveFiles());
  }

  private async runMigrations() {
    await new Promise((resolve, reject) => {
      const migrate = exec(
        'node_modules/sequelize-cli/lib/sequelize db:migrate',
        { env: process.env },
        (err) => (err ? reject(err) : resolve(undefined)),
      );

      // Forward stdout+stderr to this process
      migrate.stdout.pipe(process.stdout);
      migrate.stderr.pipe(process.stderr);
    });
  }

  private async loadAllServerControllers() {
    useExpressServer(this.expressApp, {
      routePrefix: '/server',
      controllers: [this.baseControllerPath],
      middlewares: [json()],
    });
  }
}

const app = new OtaHomebrewApp({
  port: 8081,
});

// import * as express from 'express';
// import { json } from 'body-parser';
// import { loadControllers } from './lib/load-server-controllers';
// import { join } from 'path';
// import { BaseError } from './lib/errors/ota-base-error';
// import { logger } from './lib/logger';

// const PORT = parseInt(process.env.PORT) || 8081;

//

// export const app = express();

// const serverRouter = express.Router();

// app.use(json());

// app.use(
//   '/server',
//   loadControllers(serverRouter, join(__dirname, '/controllers')),
// );

// app.use(
//   (
//     err: BaseError,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction,
//   ) => {
//     if (!err.errorCode) {
//       return next(err);
//     }

//     const statusCode = err.httpCode;

//     res.status(statusCode).send({
//       code: err.errorCode,
//       message: err.message,
//     });
//   },
// );

// app.listen(PORT, () => {
//   logger.info(`Listening on ${PORT}`);
// });
