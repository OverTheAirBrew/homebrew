import { Application, Request, Response } from 'express';
import { createHeater } from '../lib/peripherals/heaters';

export async function controller(app: Application) {
  app.post('/heaters', async (req: Request, res: Response) => {
    const id = await createHeater(req.body);

    res.status(201).send({
      id,
    });
  });
}
