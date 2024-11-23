import { ModelCtor, Sequelize } from 'sequelize-typescript';

export class Database {
  private static _db: Sequelize;

  public static async init(
    database: string,
    host: string,
    models?: ModelCtor[]
  ) {
    try {
      this._db = new Sequelize({
        database,
        dialect: 'postgres',
        username: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || 'root',
        host: host,
        port: Number(process.env.DATABASE_PORT) || 5432,
        logging: false,
      });

      this._db.addModels(models || []);
      await this._db.sync();

      console.log('Database connected successfully');
      return this._db;
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      return null;
    }
  }
}
