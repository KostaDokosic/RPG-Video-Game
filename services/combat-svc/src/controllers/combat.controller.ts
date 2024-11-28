import {
  AuthenticatedRequest,
  CacheClient,
  Controller,
  Error,
  sendMessage,
  ValidateSchema,
} from '@zentrix/shared';
import { Response } from 'express';
import DuelValidator from '../schemas/duel.schema';
import Duel from '../models/duel.model';
import ChallengeController from './challenge.controller';

export default class CombatController extends Controller {
  private static getCoolDownKey(
    charId: number,
    action: 'attack' | 'heal' | 'cast'
  ) {
    return `cooldown_${charId}_${action}`;
  }

  private static async setWinner(winnerId: number, loserId: number) {
    return await sendMessage('SET_WINNER', 'SET_WINNER', { winnerId, loserId });
  }

  private static async setCharacterHealth(characterId: number, health: number) {
    return await sendMessage('SET_HEALTH', 'SET_HEALTH', {
      characterId,
      health,
    });
  }

  private static async handleMove({
    req,
    res,
    action,
    damageCalculator,
    cooldownSeconds,
  }: {
    req: AuthenticatedRequest;
    res: Response;
    action: 'attack' | 'heal' | 'cast';
    damageCalculator: (attacker: any, target: any) => number;
    cooldownSeconds: number;
  }) {
    try {
      const { duel_id } = req.params;
      const duel = await Duel.findByPk(duel_id);

      if (!duel) return res.status(404).json(new Error('Duel not found.'));

      const [duelParticipant1, duelParticipant2] = await Promise.all([
        ChallengeController.getCharacterById(duel.attackerId),
        ChallengeController.getCharacterById(duel.targetId),
      ]);

      const attackerAccountId = req.account.id;
      let attacker: typeof duelParticipant1, target: typeof duelParticipant2;
      if (duelParticipant1?.createdBy === attackerAccountId) {
        attacker = duelParticipant1;
        target = duelParticipant2;
      } else {
        attacker = duelParticipant2;
        target = duelParticipant1;
      }

      if (!attacker || !target)
        return res
          .status(400)
          .json(new Error('You are not a participant of this duel.'));

      if (attacker.id != duel.nextTurnId)
        return res
          .status(400)
          .json(
            new Error(
              'It is not your turn. Please wait until your opponent finishes their turn.'
            )
          );

      const onCooldown = await CacheClient.getInstance().exists(
        CombatController.getCoolDownKey(attacker.id, action)
      );
      if (onCooldown)
        return res
          .status(400)
          .json(
            new Error(
              `You are on cooldown for this move, please wait ${cooldownSeconds} seconds before using ${action} again.`
            )
          );

      const damage = damageCalculator(attacker, target);
      const newTargetHealth = target.health - damage;

      if (action === 'heal') {
        await CombatController.setCharacterHealth(
          attacker.id,
          attacker.health + damage
        );
        return res.status(200).json({
          message: `You healed yourself for ${damage} health. Your health is now ${
            attacker.health + damage
          }.`,
        });
      }

      if (newTargetHealth <= 0) {
        const reward = await CombatController.setWinner(attacker.id, target.id);
        await duel.destroy();
        return res
          .status(200)
          .json({ matchResult: 'You won! Duel ended', reward });
      }

      await CacheClient.getInstance().setObjectEx(
        CombatController.getCoolDownKey(attacker.id, action),
        true,
        cooldownSeconds
      );
      await CombatController.setCharacterHealth(target.id, newTargetHealth);
      return res.status(200).json({
        message: `You used ${action} on ${target.name} and dealt ${damage} damage. Target has ${newTargetHealth} health left.`,
        details: {
          damage,
          targetHealth: newTargetHealth,
          health: attacker.health,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }

  @ValidateSchema(DuelValidator)
  public static async attack(req: AuthenticatedRequest, res: Response) {
    return CombatController.handleMove({
      req,
      res,
      action: 'attack',
      damageCalculator: (attacker) =>
        attacker.stats.strength + attacker.stats.agility,
      cooldownSeconds: 1,
    });
  }

  @ValidateSchema(DuelValidator)
  public static async cast(req: AuthenticatedRequest, res: Response) {
    return CombatController.handleMove({
      req,
      res,
      action: 'cast',
      damageCalculator: (attacker) => 2 * attacker.stats.intelligence,
      cooldownSeconds: 2,
    });
  }

  @ValidateSchema(DuelValidator)
  public static async heal(req: AuthenticatedRequest, res: Response) {
    return CombatController.handleMove({
      req,
      res,
      action: 'heal',
      damageCalculator: (attacker) => attacker.stats.faith,
      cooldownSeconds: 2,
    });
  }
}
