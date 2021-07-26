/* Copyright (c) 2021 Rishika Maroo */

import express, { Request, Response, NextFunction } from 'express';
import recipeRoutes from './routes/recipe';
import { json } from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import { HTTPStatusCode } from './constants';
import { Logger } from './utils/logger';
import { MONGO_CONNECT_URL, PORT } from './config';

/**
 * Inits db
 */
async function initDb() {
  const logger = new Logger();

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {});

  mongoose.connect(
    `${MONGO_CONNECT_URL}/recipe`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
    () => {
      logger.info('*** Connected to database');
    },
  );
  mongoose.set('useFindAndModify', false);
}

/**
 * Creates app
 */
async function createApp() {
  await initDb();
  const app = express();
  app.use(json());
  app.use('/recipe', recipeRoutes);
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPStatusCode.InternalServerError).json({ message: err.message });
  });
  app.listen(PORT);
}

createApp();
