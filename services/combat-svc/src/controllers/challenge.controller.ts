import {
  AuthenticatedRequest,
  Controller,
  Error,
  ICharacter,
  IItem,
  sendMessage,
  ValidateSchema,
} from '@zentrix/shared';
import { Response } from 'express';
import ChallengeValidator from '../schemas/challenge.schema';
import Duel from '../models/duel.model';
import { Op } from 'sequelize';

type CharResponse = ICharacter & {
  id: number;
  items: Array<IItem>;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    faith: number;
  };
};

export default class ChallengeController extends Controller {
  public static async getCharacterById(id: number) {
    const response = await sendMessage('GET_CHAR_BY_ID', 'GET_CHAR_BY_ID', id);
    if (!response || Object.keys(response).length === 0) return undefined;
    return response as CharResponse;
  }

  @ValidateSchema(ChallengeValidator)
  public static async challenge(req: AuthenticatedRequest, res: Response) {
    try {
      const { attackerId, targetId } = req.body;

      if (attackerId == targetId)
        return res.status(400).json(new Error('You cant attack yourself'));

      //TODO: Moze da se prebaci u validator ali ajd sad...
      const attacker = await ChallengeController.getCharacterById(attackerId);
      if (!attacker)
        return res.status(400).json(new Error('Invalid attacker id'));
      //TODO: moze da se prebaci u onaj middleware ali nemam vremena..............
      if (attacker.createdBy != req.account.id)
        return res
          .status(400)
          .json(new Error('You are not owner of this character'));
      const target = await ChallengeController.getCharacterById(targetId);
      if (!target) return res.status(400).json(new Error('Invalid target id'));

      const exists = await Duel.findOne({
        where: {
          [Op.or]: [
            { attackerId: attackerId },
            { targetId: targetId },
            { targetId: attackerId },
            { attackerId: targetId },
          ],
        },
      });
      if (exists)
        return res
          .status(400)
          .json(new Error('One of participants is already in duel.'));

      const duel = await Duel.create({
        attackerId,
        targetId,
        nextTurnId: attackerId,
      });
      return res
        .status(201)
        .json({ message: `Duel initiated with id ${duel.id}`, details: duel });
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }
}
