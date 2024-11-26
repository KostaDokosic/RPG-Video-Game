import { IItemCharacter } from '@zentrix/shared';
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  NotEmpty,
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

  @BelongsTo(() => Item)
  public item!: Item;

  @BelongsTo(() => Character)
  public character!: Character;

  @NotEmpty
  @Default(1)
  @Column(DataType.INTEGER)
  quantity: number;
}

export default ItemCharacter;
