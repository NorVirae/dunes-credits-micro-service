import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IMessageResponse, IUserRegisterResponseData } from 'src/interfaces';

@Injectable()
export class MessageHelper {
  constructor(@InjectConnection() private connection: Connection) {}

  SuccessResponse(
    message: string,
    data: IUserRegisterResponseData,
  ): IMessageResponse<IUserRegisterResponseData> {
    return { success: true, message: message, data };
  }

  ErrorResponse(message: string): IMessageResponse<null> {
    return { success: false, message: message, data: null };
  }
}
