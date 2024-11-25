import { ICharacter } from '@zentrix/shared';
import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  Unique,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import CharacterClass from './character.class.model';
import Item from './item.model';

@Table({
  tableName: 'classes',
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

  @HasMany(() => Item)
  public declare items: Item[];

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

  public get stats() {
    return this.items.reduce(
      (acc, val) => {
        acc.strength += val.bonusStrength || 0;
        acc.agility += val.bonusAgility || 0;
        acc.intelligence += val.bonusIntelligence || 0;
        acc.faith += val.bonusFaith || 0;
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
