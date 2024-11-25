import {
  AuthenticatedRequest,
  CacheClient,
  Controller,
  Error,
  Paginator,
  ValidateSchema,
} from '@zentrix/shared';
import { Response } from 'express';
import Character from '../models/character.model';
import Item from '../models/item.model';
import CharacterClass from '../models/character.class.model';
import CreateCharacterValidator from '../schemas/create.character.schema';
import CreateItemValidator from '../schemas/create.item.schema';

export default class ItemsController extends Controller {
  public static async getAllItems(req: AuthenticatedRequest, res: Response) {
    try {
      const { page, limit } = req.query;
      const data = await Paginator.paginate(
        Item,
        {},
        { page: Number(page), limit: Number(limit) }
      );

      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }

  public static async getItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const item = await Item.findByPk(id);
      if (!item) return res.status(404).json(new Error('Item not found'));

      return res.json(item.data);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }

  @ValidateSchema(CreateItemValidator)
  public static async createItem(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        name,
        description,
        bonusStrength,
        bonusAgility,
        bonusIntelligence,
        bonusFaith,
      } = req.body;

      const item = await Item.create({
        name,
        description,
        bonusStrength,
        bonusAgility,
        bonusIntelligence,
        bonusFaith,
      });

      return res.json(item.data);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }
}
