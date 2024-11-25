import { ICharacterClass } from '@zentrix/shared';
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
  tableName: 'characters',
  timestamps: true,
  paranoid: true,
})
class CharacterClass extends Model implements ICharacterClass {
  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public declare name: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.TEXT)
  public declare description: string;

  @ForeignKey(() => Character)
  @Column(DataType.INTEGER)
  characterId: number;

  @BelongsTo(() => Character)
  character: Character;
}

export default CharacterClass;
