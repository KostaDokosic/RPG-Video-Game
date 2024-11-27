import { IItem } from '@zentrix/shared';
import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  DataType,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
import Character from './character.model';
import ItemCharacter from './item-character.model';

@Table({
  timestamps: true,
  paranoid: true,
})
class Item extends Model implements IItem {
  @AllowNull(false)
  @NotEmpty
  @Unique
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

  @BelongsToMany(() => Character, () => ItemCharacter)
  characters: Character[];

  public static async exists(name: string) {
    const item = await this.findOne({
      where: { name },
      attributes: ['id'],
    });
    return item ? true : false;
  }

  public get data() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      bonusStrength: this.bonusStrength,
      bonusAgility: this.bonusAgility,
      bonusIntelligence: this.bonusIntelligence,
      bonusFaith: this.bonusFaith,
    };
  }
}

export default Item;
