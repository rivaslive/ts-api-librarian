import 'dotenv/config';
import routes from './routes';
import initializeServer from './services/server';
import createUser from './services/server/initialData';

const startServer = initializeServer(routes, {
  bootstrap: async () => {
    await createUser();
  },
});

export default startServer;
