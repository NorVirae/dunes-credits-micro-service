import { Injectable } from '@nestjs/common';
import { MessageHelper } from '../helpers/messages.helpers';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WalletService {
  constructor(
    private messagehelper: MessageHelper,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('RevokedToken') private readonly revokedTokenModel: Model<any>,
  ) {}

  transferCredits(): string {
    return 'Server Connected!';
  }

  fetchCreditsBalance(): string {
    return 'Server Connected!';
  }
}
