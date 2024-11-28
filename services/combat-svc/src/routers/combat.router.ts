import { AuthMiddleware, Route } from '@zentrix/shared';
import CombatController from '../controllers/combat.controller';

class CharacterRouter extends Route {
  protected init(): void {
    this.router.post(
      '/:duel_id/attack',
      AuthMiddleware.isAuth,
      CombatController.attack
    );
    this.router.post(
      '/:duel_id/cast',
      AuthMiddleware.isAuth,
      CombatController.cast
    );
    this.router.post(
      '/:duel_id/heal',
      AuthMiddleware.isAuth,
      CombatController.heal
    );
  }
}

export default new CharacterRouter();
