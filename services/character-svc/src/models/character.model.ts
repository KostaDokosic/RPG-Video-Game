import { ICharacter } from '@zentrix/shared';
import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  Unique,
  DataType,
  HasOne,
  HasMany,
  BelongsTo,
  ForeignKey,
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
  @Column(DataType.INTEGER)
  public declare health: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare mana: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare baseStrength: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare baseAgility: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare baseIntelligence: number;

  @AllowNull(false)
  @NotEmpty
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

  public get stats() {
    return {
      strength: this.items.reduce((acc, val) => val.bonusStrength + acc, 0),
      agility: this.items.reduce((acc, val) => val.bonusAgility + acc, 0),
      intelligence: this.items.reduce(
        (acc, val) => val.bonusIntelligence + acc,
        0
      ),
      faith: this.items.reduce((acc, val) => val.bonusFaith + acc, 0),
    };
  }
}

export default Character;
