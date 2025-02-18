import { hash, compare } from 'bcrypt';

export class Password {
  public static async hash(password: string): Promise<string> {
    return await hash(password, 10);
  }

  public static async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
