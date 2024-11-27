import { body } from 'express-validator';
import Item from '../models/item.model';

const CreateItemValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters.')
    .custom(async (name: string) => {
      const exists = await Item.exists(name);
      if (exists) throw new Error('Item with this name already exists.');
      return true;
    }),

  body('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters.'),

  body('bonusStrength')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('Bonus Strength must be an integer between 0 and 500.'),

  body('bonusAgility')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('Bonus Agility must be an integer between 0 and 500.'),

  body('bonusIntelligence')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('Bonus Intelligence must be an integer between 0 and 500.'),

  body('bonusFaith')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('Bonus Faith must be an integer between 0 and 500.'),
];

export default CreateItemValidator;
