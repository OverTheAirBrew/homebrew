import { Application, Request, Response } from 'express';
import { createHeater, getHeaters } from '../lib/peripherals/heaters';

export async function controller(app: Application) {
  app.post('/heaters', async (req: Request, res: Response) => {
    const id = await createHeater(req.body);

    res.status(201).send({
      id,
    });
  });

  app.get('/heaters', async (req: Request, res: Response) => {
    const heaters = await getHeaters();
    res.status(200).send(heaters);
  });
}
