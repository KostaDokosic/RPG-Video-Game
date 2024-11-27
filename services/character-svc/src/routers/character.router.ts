import { AuthMiddleware, Route } from '@zentrix/shared';
import CharacterController from '../controllers/character.controller';

class CharacterRouter extends Route {
  protected init(): void {
    this.router.get(
      '/',
      AuthMiddleware.isAuth,
      AuthMiddleware.isGameMaster,
      CharacterController.getAllCharacters
    );
    this.router.get(
      '/:id',
      AuthMiddleware.isAuth,
      AuthMiddleware.isGameMasterOrCharacterOwner,
      CharacterController.getCharacter
    );
    this.router.post(
      '/',
      AuthMiddleware.isAuth,
      CharacterController.createCharacter
    );
  }
}

export default new CharacterRouter();
