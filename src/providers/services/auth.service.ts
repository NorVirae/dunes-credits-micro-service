import {
  BadRequestException,
  Body,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseConfig,
  IMessageResponse,
  IPassDatas,
  IUserLoginRequestData,
  IUserLoginResponseData,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';
import { User } from 'src/schemas/user.schema';
import { MessageHelper } from '../helpers/messages.helpers';
import * as bcrypt from 'bcrypt';
import { response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private messagehelper: MessageHelper,
    private readonly mailService: MailService,
    private readonly userService: MailService,

    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('RevokedToken') private readonly revokedTokenModel: Model<any>,
  ) {}

  async register(
    createUserData: IUserRegisterRequestData,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
    try {
      const hash = await bcrypt.hash(createUserData.password, 10);

      const createdUser = new this.userModel(createUserData);
      createdUser.passwordHash = hash;
      await createdUser.save();

      return this.messagehelper.SuccessResponse<IUserRegisterResponseData>(
        'Registration Was successful!',
        {
          name: createdUser.name,
          email: createdUser.email,
        },
      );
    } catch (err) {
      return this.messagehelper.ErrorResponse<null>(
        err.message,
        err.statusCode,
      );
    }
  }

  async login(
    userData: IUserLoginRequestData,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      const user = await this.userModel
        .findOne({ email: userData.email })
        .exec();
      if (!user) throw new Error('User not Registered');

      const isMatch = await bcrypt.compare(
        userData.password,
        user.passwordHash,
      );

      if (!isMatch) throw new UnauthorizedException('Invalid');
      const payload = { sub: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);
      return this.messagehelper.SuccessResponse<IUserLoginResponseData>(
        'Login Success!',
        {
          email: user.email,
          token: token,
        },
      );
    } catch (err) {
      console.log(err);
      return this.messagehelper.ErrorResponse<null>('User Login Fail', 400);
    }
  }

  async forgottenPassword(
    userData: IUserLoginRequestData,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      // Find the user by email
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Generate a reset token and save it to the user's document
      const resetToken = await bcrypt.hash(`${user.email}${Date.now()}`, 10);
      user.resetToken = resetToken;
      await user.save();

      // Send the reset token to the user's email
      await this.mailService.sendPasswordResetEmail(user.email, resetToken);

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Password reset failed');
    }
  }

  async resetPassword(
    userData: IUserLoginRequestData,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      // Find the user by email and ensure the reset token is valid
      const user = await this.userService.findOneByEmail(email);

      if (!user || !user.resetToken) {
        throw new BadRequestException('Invalid reset token');
      }

      // Check if the provided token matches the stored reset token
      const isTokenValid = await bcrypt.compare(token, user.resetToken);

      if (!isTokenValid) {
        throw new BadRequestException('Invalid reset token');
      }

      // Update the user's password and reset token
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = newPasswordHash;
      user.resetToken = null;
      await user.save();

      return { message: 'Password reset successful' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Password reset failed');
    }
  }

  async changePassword(
    passDatas: IPassDatas,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      const user = await this.findOneById(userId);

      if (!user) {
        throw new Error('User not found');
      }
      const isOldPasswordValid = await bcrypt.compare(
        passDatas.oldPassword,
        user.passwordHash,
      );

      if (!isOldPasswordValid) {
        throw new BadRequestException('Invalid old password');
      }
      user.passwordHash = await bcrypt.hash(passDatas.newPassword, 10);
      await user.save();

      return this.messagehelper.SuccessResponse();
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }

  async verifyEmail(
    userData: IUserLoginRequestData,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      const user = await this.userService.findOneById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      user.emailVerified = true;
      await user.save();
    } catch (error) {
      throw new Error(`Error verifying email: ${error.message}`);
    }
  }

  async logout(
    userData: IUserLoginRequestData,
    @Req() request: Request,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      // Extract the authentication token from the request, assuming it's stored in headers or cookies
      const authToken =
        request.headers.authorization || request.cookies['yourAuthToken'];

      if (!authToken) {
        throw new BadRequestException('No authentication token found');
      }

      // Implement your logout logic based on your authentication mechanism
      // For example, you might revoke the token, remove it from a session store, or perform other cleanup actions

      await this.authService.logoutUser(authToken); // Implement this method in your AuthService

      // Optionally, you may want to clear cookies or perform additional actions based on your authentication strategy.

      return { message: 'Logout successful' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Logout failed');
    }
  }

  async revokeJwtToken(token: string): Promise<void> {
    try {
      // Check if the token is already revoked
      const existingRevocation = await this.revokedTokenModel.findOne({
        token,
      });

      if (existingRevocation) {
        throw new Error('Token has already been revoked');
      }

      // Store the revoked token in the database
      await this.revokedTokenModel.create({ token });

      // Placeholder: Implement any additional cleanup or logic based on your requirements
    } catch (error) {
      console.error(`Token revocation failed: ${error.message}`);
      throw new Error('Token revocation failed');
    }
  }
}
