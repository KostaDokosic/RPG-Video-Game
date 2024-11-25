import { IItem } from '@zentrix/shared';
import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Character from './character.model';

@Table({
  tableName: 'items',
  timestamps: true,
  paranoid: true,
})
class Item extends Model implements IItem {
  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public declare name: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.TEXT)
  public declare description: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare bonusStrength: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare bonusAgility: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare bonusIntelligence: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare bonusFaith: number;

  @ForeignKey(() => Character)
  @Column(DataType.INTEGER)
  characterId: number;

  @BelongsTo(() => Character)
  character: Character;
}

export default Item;
