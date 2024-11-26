import {
  AuthenticatedRequest,
  CacheClient,
  Controller,
  Error,
  Paginator,
  ValidateSchema,
} from '@zentrix/shared';
import { Response } from 'express';
import Item from '../models/item.model';
import CreateItemValidator from '../schemas/create.item.schema';
import GrantItemValidator from '../schemas/grant.item.schema';
import Character from '../models/character.model';
import GiftItemValidator from '../schemas/gift.item.schema';
import ItemCharacter from '../models/item-character.model';
import CharacterController from './character.controller';

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

  @ValidateSchema(GrantItemValidator)
  public static async grantItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { characterId, itemId } = req.body;

      const character = await Character.findByPk(characterId, {
        attributes: ['id'],
        include: [
          {
            model: Item,
            as: 'items',
            through: { attributes: ['quantity'] },
          },
        ],
      });

      const existingItem = character.items.find((i) => i.id == itemId);
      if (existingItem) {
        const updatedRows = await ItemCharacter.update(
          { quantity: (existingItem.ItemCharacter.quantity || 0) + 1 },
          {
            where: {
              characterId: character.id,
              itemId: itemId,
            },
          }
        );

        if (updatedRows[0] > 0) {
          CacheClient.getInstance().destroyObject(
            CharacterController.getCharacterCacheKey(characterId)
          );
          return res.status(200).json({
            message: 'Item quantity successfully updated for character.',
          });
        }

        return res
          .status(500)
          .json({ error: 'Failed to update item quantity.' });
      }

      const item = await Item.findByPk(itemId, { attributes: ['id'] });
      await character.$add('items', item.id);
      CacheClient.getInstance().destroyObject(
        CharacterController.getCharacterCacheKey(characterId)
      );
      return res
        .status(200)
        .json({ message: 'Item successfully assigned to character.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json(new Error('Internal Server Error'));
    }
  }

  @ValidateSchema(GiftItemValidator)
  public static async giftItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { sourceId, targetId, itemId } = req.body;

      const source = await Character.findByPk(sourceId, {
        attributes: ['id'],
        include: [
          {
            model: Item,
            as: 'items',
            through: { attributes: ['quantity'] },
          },
        ],
      });

      if (!source) {
        return res.status(404).json({ error: 'Source character not found.' });
      }

      const sourceItem = source.items.find(
        (item) => item.id === itemId
      ) as Item & { ItemCharacter: { quantity: number } };

      if (!sourceItem || sourceItem.ItemCharacter.quantity < 1) {
        return res
          .status(400)
          .json({ error: `Source character doesn't have this item.` });
      }

      const target = await Character.findByPk(targetId, {
        attributes: ['id'],
        include: [
          {
            model: Item,
            as: 'items',
            through: { attributes: ['quantity'] },
          },
        ],
      });

      if (!target) {
        return res.status(404).json({ error: 'Target character not found.' });
      }

      if (sourceItem.ItemCharacter.quantity > 1) {
        await ItemCharacter.update(
          { quantity: sourceItem.ItemCharacter.quantity - 1 },
          {
            where: {
              characterId: sourceId,
              itemId: itemId,
            },
          }
        );
      } else {
        await source.$remove('items', sourceItem);
      }

      const targetItem = target.items.find(
        (item) => item.id === itemId
      ) as Item & { ItemCharacter: { quantity: number } };

      if (targetItem) {
        await ItemCharacter.update(
          { quantity: (targetItem.ItemCharacter.quantity || 0) + 1 },
          {
            where: {
              characterId: targetId,
              itemId: itemId,
            },
          }
        );
      } else {
        await ItemCharacter.create({
          characterId: target.id,
          itemId: itemId,
          quantity: 1,
        });
      }

      CacheClient.getInstance().destroyObject(
        CharacterController.getCharacterCacheKey(sourceId)
      );
      CacheClient.getInstance().destroyObject(
        CharacterController.getCharacterCacheKey(targetId)
      );

      return res.status(200).json({ message: 'Item successfully gifted.' });
    } catch (error) {
      console.error('Error gifting item:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
