import { HydratedDocument } from 'mongoose';
import { User } from 'src/schemas/user.schema';

export interface DatabaseConfig {
  host: string;
  port: number;
}

export interface IUserRegisterRequestData {
  name: string;
  email: string;
  password: string;
}

export interface IUserRegisterResponseData {
  name: string;
  email: string;
  token?: string;
}

export interface IUserLoginRequestData {
  email: string;
  password: string;
}

export interface IUserLoginResponseData {
  email: string;
  token: string;
}

export interface IMessageResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  statusCode?: number;
}

export interface IPassDatas {
  oldPassword: string;
  newPassword: string;
  userId: string;
}
