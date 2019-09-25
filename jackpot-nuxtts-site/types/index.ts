import { Money, Currencies } from "ts-money"

export * from './state';

export interface IBankAccount {
  id: number,
  first_name: string
}

export interface PotBankAccount extends IBankAccount{
  id: number,
  first_name: string
}

export interface Person extends IBankAccount {
  id: number;
  first_name: string;
  last_name?: string;
  contact?: Contact;
  gender?: string;
  ip_address?: string;
  avatar?: string;
  address?: Address;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Address {
  city: string;
  country: string;
  postalCode: string;
  state: string;
  street: string;
}

export interface GameMoneyTransaction {
  amount: Money;
  fromAccount: IBankAccount;
  toAccount: IBankAccount;
  uuid?: string;
}

export interface GameObject {
  transactions: GameMoneyTransaction[];
  players: Person[];
  pot: PotBankAccount;
}

export interface PlayerListTableData {
  data: PlayerListRow[],
  columns: TableColumn[]
}

export interface PlayerListRow {
  id: number,
  first_name: string,
  balance: string
}

export interface TableColumn {
  field: string,
  label: string,
  centered?: boolean,
  width?: string,
  numeric?: boolean
}

export interface GamePayoutStrategy {
  transactions: GameMoneyTransaction[]
  unmatchedBalances: GamePlayerBalanceRow[]
}

export interface GamePlayerBalanceRow {
    player:Person
    balance:number
}

export interface PayoutTableRow {
  id?: number
  fromAccount: IBankAccount[],
  toAccount: IBankAccount,
  amount: Money
}
