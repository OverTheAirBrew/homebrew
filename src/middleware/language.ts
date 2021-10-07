import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { LocaleService } from '../lib/locale-service';

export async function setupLanguage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(req.acceptsLanguages());

  const localeService = Container.get(LocaleService);
  await localeService.setLocale(req.acceptsLanguages());

  next();
}
