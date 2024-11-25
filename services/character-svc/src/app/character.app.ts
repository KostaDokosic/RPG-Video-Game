import { CoreApp } from '@zentrix/shared';
import characterController from '../routers/character.router';

export default class App extends CoreApp {
  protected async init() {
    super.init();
    this.router.use('/character', characterController.routes);
  }
}
