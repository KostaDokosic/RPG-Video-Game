import { config } from 'dotenv';
import App from './app/combat.app';
import { CacheClient } from '@zentrix/shared';

console.info(`Starting combat-svc in ${process.env.MODE || 'dev'} mode...`);
if (process.env.MODE === 'prod') {
  config({
    path: './dist/services/combat-svc/.env',
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 9003;
const app = new App();

app.listen(port, () => {
  console.log('Server is listening on port ' + port);
  CacheClient.getInstance().startClient();
});
