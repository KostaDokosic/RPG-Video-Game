import { Request } from 'express';

export type IAccount = {
  name: string;
  role: AccountRole;
};

export enum AccountRole {
  user = 'User',
  gamemaster = 'GameMaster',
}

export interface AuthenticatedRequest extends Request {
  user: IAccount;
}
