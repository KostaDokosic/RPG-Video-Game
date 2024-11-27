import { body } from 'express-validator';
import Item from '../models/item.model';
import Character from '../models/character.model';

const GrantItemValidator = [
  body('characterId')
    .exists({ checkFalsy: true })
    .withMessage('Character Id is required.')
    .isInt()
    .withMessage('Invalid Id provided.')
    .custom(async (id: number) => {
      const character = await Character.findByPk(id, { attributes: ['id'] });
      if (!character) throw new Error('Character with that id was not found.');
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

export default GrantItemValidator;
