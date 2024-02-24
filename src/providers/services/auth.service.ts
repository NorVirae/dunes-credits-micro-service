import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseConfig,
  IMessageResponse,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';
import { User } from 'src/schemas/user.schema';
import { MessageHelper } from '../helpers/messages.helpers';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private messagehelper: MessageHelper,
    @InjectModel(User.name) private catModel: Model<User>,
  ) {}
  login(): string {
    const dbConfig = this.configService.get<DatabaseConfig>('database');
    console.log(dbConfig);
    return 'Server Connected!';
  }

  async register(
    createUserData: IUserRegisterRequestData,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
    const createdUser = new this.catModel(createUserData);
    await createdUser.save();
    return this.messagehelper.SuccessResponse('Registration Was successful!', {
      name: createdUser.name,
      email: createdUser.email,
    });
  }
}
