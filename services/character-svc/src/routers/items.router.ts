import { AuthMiddleware, Route } from '@zentrix/shared';
import ItemsController from '../controllers/items.controller';

class ItemsRouter extends Route {
  protected init(): void {
    this.router.get(
      '/',
      AuthMiddleware.isAuth,
      AuthMiddleware.isGameMaster,
      ItemsController.getAllItems
    );
    this.router.get(
      '/:id',
      AuthMiddleware.isAuth,
      AuthMiddleware.isGameMaster,
      ItemsController.getItem
    );
    this.router.post('/', AuthMiddleware.isAuth, ItemsController.createItem);
  }
}

export default new ItemsRouter();
