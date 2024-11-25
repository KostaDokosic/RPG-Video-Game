import { Route } from '@zentrix/shared';
import CharacterController from '../controllers/character.controller';

class CharacterRouter extends Route {
  protected init(): void {
    this.router.get('/', CharacterController.getAllCharacters);
    // this.router.get('/:id', CharacterController.getCharacter);
    // this.router.post('/', CharacterController.createCharacter);
  }
}

export default new CharacterRouter();
