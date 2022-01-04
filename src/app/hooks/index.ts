import { registerController, useContainer } from 'cron-typedi-decorators';
import { join } from 'path';
import Container from 'typedi';

export async function startHooks() {
  useContainer(Container);

  registerController([join(__dirname, '*.js')]);
}
