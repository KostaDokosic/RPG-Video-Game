import { body } from 'express-validator';
import Character from '../models/character.model';

const CreateCharacterValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters.')
    .custom(async (name: string) => {
      const exists = await Character.exists(name);
      if (exists) throw new Error('Character with this name already exists.');
      return true;
    }),

  body('health')
    .exists({ checkFalsy: true })
    .withMessage('Health is required.')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Health must be an integer between 1 and 1000.'),

  body('mana')
    .exists({ checkFalsy: true })
    .withMessage('Mana is required.')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Mana must be an integer between 1 and 1000.'),

  body('baseStrength')
    .exists({ checkFalsy: true })
    .withMessage('Base Strength is required.')
    .isInt({ min: 0, max: 500 })
    .withMessage('Base Strength must be an integer between 0 and 500.'),

  body('baseAgility')
    .exists({ checkFalsy: true })
    .withMessage('Base Agility is required.')
    .isInt({ min: 0, max: 500 })
    .withMessage('Base Agility must be an integer between 0 and 500.'),

  body('baseIntelligence')
    .exists({ checkFalsy: true })
    .withMessage('Base Intelligence is required.')
    .isInt({ min: 0, max: 500 })
    .withMessage('Base Intelligence must be an integer between 0 and 500.'),

  body('baseFaith')
    .exists({ checkFalsy: true })
    .withMessage('Base Faith is required.')
    .isInt({ min: 0, max: 500 })
    .withMessage('Base Faith must be an integer between 0 and 500.'),

  body('class.name')
    .exists({ checkFalsy: true })
    .withMessage('Class name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Class name must be between 2 and 100 characters.'),

  body('class.description')
    .exists({ checkFalsy: true })
    .withMessage('Class description is required.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Class description must be between 10 and 1000 characters.'),
];

export default CreateCharacterValidator;
