import { ICharacterClass } from '@zentrix/shared';
import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  DataType,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import Character from './character.model';

@Table({
  timestamps: true,
  paranoid: true,
})
class CharacterClass extends Model implements ICharacterClass {
  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column(DataType.STRING)
  public declare name: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.TEXT)
  public declare description: string;

  @HasMany(() => Character)
  character: Character;

  public get data() {
    return {
      name: this.name,
      description: this.description,
    };
  }

  public static async exists(name: string) {
    const c = await this.findOne({
      where: { name },
      attributes: ['id'],
    });
    return c ? true : false;
  }
}

export default CharacterClass;
