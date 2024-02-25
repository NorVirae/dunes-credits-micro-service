// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOneById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async findByVerificationToken(
    verificationToken: string,
  ): Promise<User | null> {
    return this.userModel.findOne({ verificationToken }).exec();
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const user = await this.findOneById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }
}
