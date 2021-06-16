import * as express from 'express';
import { json } from 'body-parser';
import { loadControllers } from './lib/load-server-controllers';
import { join } from 'path';
import { BaseError } from './lib/errors/ota-base-error';
import { logger } from './lib/logger';

const PORT = parseInt(process.env.PORT) || 8081;

require('express-async-errors');

export const app = express();

const serverRouter = express.Router();

app.use(json());

app.use(
  '/server',
  loadControllers(serverRouter, join(__dirname, '/controllers')),
);

app.use(
  (
    err: BaseError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (!err.errorCode) {
      return next(err);
    }

    const statusCode = err.httpCode;

    res.status(statusCode).send({
      code: err.errorCode,
      message: err.message,
    });
  },
);

app.listen(PORT, () => {
  logger.info(`Listening on ${PORT}`);
});
