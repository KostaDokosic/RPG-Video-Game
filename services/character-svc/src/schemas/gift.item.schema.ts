import { body } from 'express-validator';
import Item from '../models/item.model';
import Character from '../models/character.model';

const GiftItemValidator = [
  body('sourceId')
    .exists({ checkFalsy: true })
    .withMessage('Source Id is required.')
    .isInt()
    .withMessage('Invalid Id provided.')
    .custom(async (id: number) => {
      const character = await Character.findByPk(id, { attributes: ['id'] });
      if (!character) throw new Error('Source with that id was not found.');
      return true;
    }),
  body('targetId')
    .exists({ checkFalsy: true })
    .withMessage('Target Id is required.')
    .isInt()
    .withMessage('Invalid Id provided.')
    .custom(async (id: number) => {
      const character = await Character.findByPk(id, { attributes: ['id'] });
      if (!character) throw new Error('Target with that id was not found.');
      return true;
    }),
  body('itemId')
    .exists({ checkFalsy: true })
    .withMessage('Item Id is required.')
    .isInt()
    .withMessage('Item Id provided.')
    .custom(async (id: number) => {
      const item = await Item.findByPk(id, { attributes: ['id'] });
      if (!item) throw new Error('Item with that id was not found.');
      return true;
    }),
];

export default GiftItemValidator;
