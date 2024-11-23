import { AccountRole } from '@zentrix/shared';
import { body } from 'express-validator';
import Account from '../models/account.model';
import { IsStrongPasswordOptions } from 'express-validator/lib/options';

const PASSWORD_STRENGTH: IsStrongPasswordOptions = {
  minLength: 6,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 0,
};
export const NAME_RULE = /^[a-zA-Z0-9]+$/; //No whitespace + no special characters

const SignUpValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Invalid name length')
    .custom((name) => {
      if (NAME_RULE.test(name)) return true;
      throw new Error('Invalid characters in name.');
    })
    .custom(async (name) => {
      const exists = await Account.exists(name);
      if (exists) throw new Error('Account with this name already exists.');
      return true;
    }),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
    .isLength({ min: PASSWORD_STRENGTH.minLength, max: 64 })
    .withMessage('Password is too short')
    .isStrongPassword(PASSWORD_STRENGTH)
    .withMessage(
      'Weak password. Password must contains minimum 6 characters, 1 lowercase and 1 number.'
    ),
  body('password_confirmation')
    .exists({ checkFalsy: true })
    .withMessage('Password confirmation required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  body('role')
    .exists({ checkFalsy: true })
    .withMessage('Role is required')
    .isString()
    .withMessage('Invalid role type')
    .toLowerCase()
    .custom((value, { req }) => {
      if (!Object.keys(AccountRole).some((role) => role === value)) {
        throw new Error(
          `Invalid role provided. Role can only be: ${Object.keys(
            AccountRole
          ).join(' or ')}`
        );
      }
      return true;
    }),
];

export default SignUpValidator;
