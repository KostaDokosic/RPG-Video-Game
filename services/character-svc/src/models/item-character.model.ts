import { IItemCharacter } from '@zentrix/shared';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Character from './character.model';
import Item from './item.model';

@Table
class ItemCharacter extends Model implements IItemCharacter {
  @ForeignKey(() => Character)
  @Column(DataType.INTEGER)
  characterId: number;

  @ForeignKey(() => Item)
  @Column(DataType.INTEGER)
  itemId: number;
}

export default ItemCharacter;
