import { CoreApp } from '@zentrix/shared';
import characterRouter from '../routers/character.router';
import itemsRouter from '../routers/items.router';

export default class App extends CoreApp {
  protected async init() {
    super.init();
    this.router.use('/character', characterRouter.routes);
    this.router.use('/items', itemsRouter.routes);
  }
}
