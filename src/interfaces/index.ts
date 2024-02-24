import { HydratedDocument } from 'mongoose';
import { User } from 'src/schemas/user.schema';

export interface DatabaseConfig {
  host: string;
  port: number;
}

export interface IUserRegisterRequestData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface IUserRegisterResponseData {
  name: string;
  email: string;
  token?: string;
}

export interface IMessageResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}
