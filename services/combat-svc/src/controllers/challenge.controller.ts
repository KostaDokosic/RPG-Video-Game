import {
  AuthenticatedRequest,
  CacheClient,
  Controller,
  Error,
  ICharacter,
  sendMessage,
  ValidateSchema,
} from '@zentrix/shared';
import { Response } from 'express';
import ChallengeValidator from '../schemas/challenge.schema';

export default class ChallengeController extends Controller {
  private static async getCharacterById(id: number) {
    const response = await sendMessage('GET_CHAR_BY_ID', 'GET_CHAR_BY_ID', id);
    if (!response || Object.keys(response).length === 0) return undefined;
    type CharResponse = ICharacter & { id: number };
    return response as CharResponse;
  }

  private static getDuelKey(attacker: number, target: number) {
    return `duel_${attacker}_${target}`;
  }

  @ValidateSchema(ChallengeValidator)
  public static async challenge(req: AuthenticatedRequest, res: Response) {
    try {
      const { attackerId, targetId } = req.body;

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

      const key = ChallengeController.getDuelKey(attackerId, targetId);
      const exists = await CacheClient.getInstance().exists(key);
      if (exists)
        return res.status(400).json(new Error('Duel already initiated'));

      await CacheClient.getInstance().setObject(key, true);
      return res.status(201).json({ message: 'Duel initiated' });
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }
}
