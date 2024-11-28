import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  DataType,
} from 'sequelize-typescript';
import { IDuel } from '@zentrix/shared';

@Table({
  timestamps: true,
  paranoid: false,
})
class Duel extends Model implements IDuel {
  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare attackerId: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare targetId: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.INTEGER)
  public declare nextTurnId: number;

  public get data() {
    return {
      id: this.id,
      targetId: this.targetId,
      attackerId: this.attackerId,
    };
  }
}

export default Duel;
