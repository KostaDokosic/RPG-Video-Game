import { CoreApp } from '@zentrix/shared';
import challengeRouter from '../routers/challenge.router';
import combatRouter from '../routers/combat.router';

export default class App extends CoreApp {
  protected async init() {
    super.init();
    this.router.use('/challenge', challengeRouter.routes);
    this.router.use('/', combatRouter.routes);
  }
}
