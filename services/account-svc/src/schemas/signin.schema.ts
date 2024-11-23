import { body } from 'express-validator';

const SignInValidator = [
  body('name').exists({ checkFalsy: true }).withMessage('Name required'),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
];

export default SignInValidator;
