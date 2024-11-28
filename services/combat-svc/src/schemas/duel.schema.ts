import { param } from 'express-validator';
import Duel from '../models/duel.model';

const DuelValidator = [
  param('duel_id')
    .exists({ checkFalsy: true })
    .withMessage('Duel Id is required.')
    .isInt()
    .withMessage('Invalid Duel id')
    .custom(async (duelId: number) => {
      const duel = await Duel.findByPk(duelId, { attributes: ['id'] });
      if (!duel) throw new Error('Invalid duel id');
      return true;
    }),
];

export default DuelValidator;
