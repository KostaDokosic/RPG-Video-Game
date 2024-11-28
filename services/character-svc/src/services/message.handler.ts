import { receiveMessage } from '@zentrix/shared';
import Character from '../models/character.model';
import CharacterClass from '../models/character.class.model';
import Item from '../models/item.model';

export default function handleMessages() {
  receiveMessage(
    'GET_CHAR_BY_ID',
    'GET_CHAR_BY_ID',
    'GET_CHAR_BY_ID',
    async function (id: number) {
      const character = await Character.findByPk(id, {
        include: [
          { model: CharacterClass, as: 'class' },
          { model: Item, as: 'items' },
        ],
      });
      const stats = await character?.stats();
      if (character) return { ...character?.data, stats };
      return {};
    }
  );
  receiveMessage(
    'SET_WINNER',
    'SET_WINNER',
    'SET_WINNER',
    async function ({
      winnerId,
      loserId,
    }: {
      winnerId: number;
      loserId: number;
    }) {
      const loser = await Character.findByPk(loserId, {
        include: [
          { model: CharacterClass, as: 'class' },
          { model: Item, as: 'items' },
        ],
      });
      const winner = await Character.findByPk(winnerId);

      if (loser.items?.length > 0) {
        const i = Math.floor(Math.random() * loser.items.length);
        const randomLoserItem = loser.items[i];
        await winner.$add('items', randomLoserItem.id);
        await loser.destroy({ force: true });
        return randomLoserItem.data;
      }
      return { data: 'No reward received because target has no items.' };
    }
  );
  receiveMessage(
    'SET_HEALTH',
    'SET_HEALTH',
    'SET_HEALTH',
    async function ({
      characterId,
      health,
    }: {
      characterId: number;
      health: number;
    }) {
      return await Character.update(
        { health },
        { where: { id: characterId }, limit: 1 }
      );
    }
  );
}
