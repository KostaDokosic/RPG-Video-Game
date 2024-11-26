import { ICharacter } from '@zentrix/shared';
import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  Unique,
  DataType,
  BelongsTo,
  ForeignKey,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import CharacterClass from './character.class.model';
import Item from './item.model';
import ItemCharacter from './item-character.model';

@Table({
  timestamps: true,
  paranoid: true,
})
class Character extends Model implements ICharacter {
  @Unique
  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public declare name: string;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column(DataType.INTEGER)
  public declare health: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column(DataType.INTEGER)
  public declare mana: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column(DataType.INTEGER)
  public declare baseStrength: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column(DataType.INTEGER)
  public declare baseAgility: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column(DataType.INTEGER)
  public declare baseIntelligence: number;

  @AllowNull(false)
  @NotEmpty
  @Default(0)
  @Column(DataType.INTEGER)
  public declare baseFaith: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare createdBy: number;

  @ForeignKey(() => CharacterClass)
  @Column(DataType.INTEGER)
  classId: number;

  @BelongsTo(() => CharacterClass)
  public declare class: CharacterClass;

  @BelongsToMany(() => Item, () => ItemCharacter)
  public items!: (Item & { ItemCharacter: { quantity: number } })[];

  public static async exists(name: string) {
    const character = await this.findOne({
      where: { name },
      attributes: ['id'],
    });
    return character ? true : false;
  }

  public get data() {
    return {
      name: this.name,
      health: this.health,
      baseAgility: this.baseAgility,
      baseStrength: this.baseStrength,
      baseIntelligence: this.baseIntelligence,
      baseFaith: this.baseFaith,
      items: this.items,
      class: this.class.data,
    };
  }

  public async stats() {
    const itemsWithQuantities = await this.$get('items');

    return itemsWithQuantities.reduce(
      (acc, item: Item & { ItemCharacter: { quantity: number } }) => {
        const quantity = item.ItemCharacter?.quantity || 1;

        acc.strength += (item.bonusStrength || 0) * quantity;
        acc.agility += (item.bonusAgility || 0) * quantity;
        acc.intelligence += (item.bonusIntelligence || 0) * quantity;
        acc.faith += (item.bonusFaith || 0) * quantity;

        return acc;
      },
      {
        strength: this.baseStrength,
        agility: this.baseAgility,
        intelligence: this.baseIntelligence,
        faith: this.baseFaith,
      }
    );
  }
}

export default Character;
