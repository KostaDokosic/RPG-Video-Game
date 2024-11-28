import { body } from 'express-validator';

const ChallengeValidator = [
  body('attackerId')
    .exists({ checkFalsy: true })
    .withMessage('Attacker Id is required.')
    .isInt(),
  body('targetId')
    .exists({ checkFalsy: true })
    .withMessage('Target Id is required.')
    .isInt(),
];

export default ChallengeValidator;
