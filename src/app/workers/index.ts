import {
  Queues,
  registerController,
  useContainer,
} from '@overtheairbrew/node-typedi-in-memory-queue';
import { join } from 'path';
import 'reflect-metadata';
import Container from 'typedi';

export async function startWorkers() {
  useContainer(Container);

  const queues = new Queues();
  Container.set(Queues, queues);

  registerController([join(__dirname, '**', '*.js')], queues);
}
