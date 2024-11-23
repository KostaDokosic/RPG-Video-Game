import { CoreApp } from '@zentrix/shared';
import accountRouter from '../routers/account.router';

export default class App extends CoreApp {
  protected async init() {
    super.init();
    this.router.use('/account', accountRouter.routes);
  }
}
