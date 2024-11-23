import { config } from 'dotenv';
import App from './app/account.app';
import Account from './models/account.model';
import { Database } from '@zentrix/shared';

console.info(`Starting account-svc in ${process.env.MODE || 'dev'} mode...`);
if (process.env.MODE === 'prod') {
  config({
    path: './dist/services/account-svc/.env',
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 9001;
const app = new App();

app.listen(port, () => {
  console.log('Server is listening on port ' + port);
  Database.init('accounts', 'account-svc-db', [Account]);
});
