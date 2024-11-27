import { receiveMessage } from '@zentrix/shared';
import Character from '../models/character.model';
import CharacterClass from '../models/character.class.model';

export default function handleMessages() {
  receiveMessage(
    'GET_CHAR_BY_ID',
    'GET_CHAR_BY_ID',
    'GET_CHAR_BY_ID',
    async function (id: number) {
      const character = await Character.findByPk(id, {
        include: [{ model: CharacterClass, as: 'class' }],
      });
      if (character) return character?.data;
      return {};
    }
  );
}
