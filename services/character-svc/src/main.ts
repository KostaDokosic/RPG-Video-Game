import { config } from 'dotenv';
import App from './app/character.app';
import { Database } from '@zentrix/shared';
import Character from './models/character.model';
import CharacterClass from './models/character.class.model';
import Item from './models/item.model';

console.info(`Starting character-svc in ${process.env.MODE || 'dev'} mode...`);
if (process.env.MODE === 'prod') {
  config({
    path: './dist/services/character-svc/.env',
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 9002;
const app = new App();

app.listen(port, () => {
  console.log('Server is listening on port ' + port);
  Database.init('characters', 'character-svc-db', [
    Character,
    CharacterClass,
    Item,
  ]);
});
