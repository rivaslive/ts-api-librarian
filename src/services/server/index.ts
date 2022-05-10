import express from 'express';
import cors from 'cors';

import getConfig from '../../config';
import initializeDB from './db';

const { port } = getConfig;

const app = express();

// creating server
const initializeServer = async (routes, opts?: { bootstrap?: () => Promise<any> }) => {
  // initialize DB
  await initializeDB();

  app.use(cors());
  app.use(express.json());
  app.use(routes);

  if (opts && opts.bootstrap) {
    await opts.bootstrap();
  }

  // create express app
  app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
  });
};

export default initializeServer;
