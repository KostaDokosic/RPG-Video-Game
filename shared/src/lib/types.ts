import { Request } from 'express';

export interface IAccount {
  id?: number;
  name: string;
  role: AccountRole;
}

export enum AccountRole {
  user = 'User',
  gamemaster = 'GameMaster',
}

export interface AuthenticatedRequest extends Request {
  account: IAccount;
}

export interface ICharacter {
  name: string;
  health: number;
  mana: number;
  baseStrength: number;
  baseAgility: number;
  baseIntelligence: number;
  baseFaith: number;
  class: ICharacterClass;
  items: IItem[];
  createdBy: number;
}

export interface ICharacterClass {
  name: string;
  description: string;
}

export interface IItem {
  name: string;
  description: string;
  bonusStrength: number;
  bonusAgility: number;
  bonusIntelligence: number;
  bonusFaith: number;
}

export interface IItemCharacter {
  characterId: number;
  itemId: number;
}
