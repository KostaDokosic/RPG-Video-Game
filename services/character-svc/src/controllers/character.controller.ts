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

export default class AccountController extends Controller {
  private static getCharacterCacheKey(characterId: number) {
    return `character_${characterId}`;
  }

  public static async getAllCharacters(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const { page, limit } = req.query;
      const data = await Paginator.paginate(
        Character,
        { attributes: ['id', 'name', 'health', 'mana'] },
        { page: Number(page), limit: Number(limit) }
      );

      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }

  public static async getCharacter(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const cachedCharacter = await CacheClient.getInstance().getObject(
        AccountController.getCharacterCacheKey(Number(id))
      );
      if (cachedCharacter) return res.json(cachedCharacter);

      const character = await Character.findByPk(id, {
        include: [
          { model: Item, as: 'items' },
          { model: CharacterClass, as: 'class' },
        ],
      });

      if (!character)
        return res.status(404).json(new Error('Character not found'));

      const fullCharacter = {
        ...character.data,
        stats: character.stats,
      };
      CacheClient.getInstance().setObject(
        AccountController.getCharacterCacheKey(Number(id)),
        fullCharacter
      );
      return res.json(fullCharacter);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }

  @ValidateSchema(CreateCharacterValidator)
  public static async createCharacter(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const {
        name,
        health,
        mana,
        baseStrength,
        baseIntelligence,
        baseAgility,
        baseFaith,
        class: characterClass,
      } = req.body;

      const createdBy = req.account.id;

      const createdClass = await CharacterClass.findOrCreate({
        where: { name: characterClass.name },
        defaults: { ...characterClass },
      });

      const character = await Character.create(
        {
          name,
          health,
          mana,
          baseAgility,
          baseStrength,
          baseFaith,
          baseIntelligence,
          createdBy,
          classId: createdClass[0].id,
        },
        {
          include: [
            { model: CharacterClass, as: 'class' },
            { model: Item, as: 'items' },
          ],
        }
      );

      return res.json(character);
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }
}
