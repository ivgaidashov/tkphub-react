export interface ToolCardTypes {
  id: number;
  title: string;
  description: string;
  icon: string;
  available: number;
  link: string;
}
export interface IconProps {
  icon: string;
  availability: number;
}

export interface DataAcc {
  acc: string;
  date: string;
}

export interface ModulesType {
  id: number;
  title: string;
  description: string;
  icon: string;
  available: number;
  link: string;
}

export interface userReports {
  available_reports: string[];
}

export interface reportData {
  id: string,
  report: string;
  CNAME: string;
  CTITLE: string;
  IPOSITION: string;
  CUSRLOGNAME: string;
}

export interface responseSignors {
  result: string,
}

export interface devicePassport {
  id: string | null,
  ASSET_NMB: string  | null,
  TYPE_NMB: number  | string | null, /* комп, сервер, т.п.*/
  CATEGORY: string | null, /*физический, виртуальный */
  processNumber:  number[] | null, /* с 1 по 11, передаем строкой, а на фласке делаем list  */
  USR: string  | null,
  TITLE: string  | null,
  OS: string  | null,
  IP_ADDRESS: string  | null,
  BRANCH: string  | null,
  DEPARTMENT: string  | null,
  MOTHERBOARD: string  | null,
  CPU: string  | null,
  RAM: string  | null,
  HARD_DRIVE: string  | null,
  NOTES: string  | null
}

export interface idTitle {
  id: number,
  title: string
}

export type idTitleList = idTitle[]

export interface ClientEgrul {
  icusnum: number,
  title: string,
  ccusidopen: string,
}

export type ClientEgrulList = ClientEgrul[]

export interface ClientDifferenceEgrul {
  title: string,
  column: string | null,
  egrul: string,
  abs: string
}

export type ClientDifferenceEgrulList = ClientDifferenceEgrul[] | undefined
