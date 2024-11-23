import {
  Controller,
  Error,
  ValidateSchema,
  Password,
  Token,
} from '@zentrix/shared';
import SignUpValidator from '../schemas/signup.schema';
import { Request, Response } from 'express';
import Account from '../models/account.model';
import SignInValidator from '../schemas/signin.schema';

export default class AccountController extends Controller {
  @ValidateSchema(SignUpValidator)
  public static async signup(req: Request, res: Response) {
    try {
      const { name, role, password } = req.body;
      const hashed_password = await Password.hash(password);
      const account = await Account.create({
        name,
        role,
        password: hashed_password,
      });

      return res.status(201).json(account.data);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }

  @ValidateSchema(SignInValidator)
  public static async signin(req: Request, res: Response) {
    try {
      const { name, password } = req.body;

      const account = await Account.findOne({ where: { name } });

      if (!account)
        return res.status(401).json(new Error('Invalid Credentials'));

      const passwordMatch = await Password.compare(
        password,
        account.hashedPassword
      );
      if (!passwordMatch)
        return res.status(401).json(new Error('Invalid Credentials'));

      const token = await Token.create(account);

      return res.status(200).json({
        ...account.data,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }
}
