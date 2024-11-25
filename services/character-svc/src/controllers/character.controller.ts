import { Controller, Error, Paginator } from '@zentrix/shared';
import { Request, Response } from 'express';
import Character from '../models/character.model';

export default class AccountController extends Controller {
  public static async getAllCharacters(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      const data = await Paginator.paginate(
        Character,
        {},
        { page: Number(page), limit: Number(limit) }
      );

      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }
}
