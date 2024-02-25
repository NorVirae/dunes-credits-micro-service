// user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';

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

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async UpdateUser(userData: User): Promise<boolean> {
    const result = await this.userModel
      .updateOne({ email: userData.email }, { userData })
      .exec();
    if (!result) throw new BadRequestException('Unable to  Update user');
    return true;
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);

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
