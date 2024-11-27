import { AccountRole, IAccount } from '@zentrix/shared';
import {
  Column,
  Model,
  NotEmpty,
  AllowNull,
  Table,
  Unique,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
class Account extends Model implements IAccount {
  @Unique
  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public declare name: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  public declare role: AccountRole;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  private declare password: string;

  public static async exists(name: string) {
    const account = await this.findOne({ where: { name }, attributes: ['id'] });
    return account ? true : false;
  }

  public get hashedPassword() {
    return this.password;
  }

  public get data() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

export default Account;
