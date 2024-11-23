import { Route } from '@zentrix/shared';
import AuthController from '../controllers/account.controller';

class AccountRouter extends Route {
  protected init(): void {
    this.router.post('/signup', AuthController.signup);
    this.router.post('/signin', AuthController.signin);
  }
}

export default new AccountRouter();
