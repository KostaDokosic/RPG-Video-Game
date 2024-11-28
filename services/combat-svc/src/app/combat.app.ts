import { AuthMiddleware, CoreApp } from '@zentrix/shared';
import ChallengeController from '../controllers/challenge.controller';
import combatRouter from '../routers/combat.router';

export default class App extends CoreApp {
  protected async init() {
    super.init();
    this.router.post(
      '/challenge',
      AuthMiddleware.isAuth,
      ChallengeController.challenge
    );
    this.router.use('/', combatRouter.routes);
  }
}
