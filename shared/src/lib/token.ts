import { sign, verify } from 'jsonwebtoken';
import { IAccount } from './types';

export class Token {
  private static readonly secret =
    process.env.JWT_SECRET || '_auth-jwt-secret-key1_';

  public static create(
    account: Partial<IAccount>,
    expiresIn = '7d'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign({ account }, this.secret, { expiresIn }, function (err, token) {
        if (err || !token) {
          return reject(new Error('Error while creating token: ' + err));
        }
        resolve(token);
      });
    });
  }

  public static verify(token: string) {
    return verify(token, this.secret) as { account: IAccount } | undefined;
  }
}
