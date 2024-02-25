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
import { User } from 'src/models/user.model';
import { MessageHelper } from '../helpers/messages.helpers';
import * as bcrypt from 'bcrypt';
import { response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { UserService } from './user.service';
import { JwtAuthService } from './jwtAuth.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private messagehelper: MessageHelper,
    private readonly mailService: MailService,
    private readonly jwtAuthService: JwtAuthService,

    private readonly userService: UserService,

    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('RevokedToken') private readonly revokedTokenModel: Model<any>,
  ) {}

  async register(
    createUserData: IUserRegisterRequestData,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
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
  }

  async login(
    userData: IUserLoginRequestData,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const user = await this.userModel.findOne({ email: userData.email }).exec();
    if (!user) throw new Error('User not Registered');

    const isMatch = await bcrypt.compare(userData.password, user.passwordHash);

    if (!isMatch) throw new UnauthorizedException('Invalid');
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtAuthService.generateToken(payload);
    return this.messagehelper.SuccessResponse<IUserLoginResponseData>(
      'Login Success!',
      {
        email: user.email,
        token: token,
      },
    );
  }

  async forgottenPassword(
    email: string,
  ): Promise<IMessageResponse<boolean | null>> {
    // Find the user by email
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate a reset token and save it to the user's document
    const resetToken = await bcrypt.hash(`${user.email}${Date.now()}`, 10);
    user.resetToken = resetToken;
    await this.userService.UpdateUser(user);

    // Send the reset token to the user's email
    await this.mailService.sendResetPasswordEmail(user.email, resetToken);

    return this.messagehelper.SuccessResponse<boolean>(
      'Reset Password Email has been sent',
      true,
    );
  }

  async resetPassword(
    email: string, // Assuming you receive the user's email
    token: string, // Assuming you receive the reset token
    newPassword: string,
  ): Promise<boolean> {
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
    await this.userService.UpdateUser(user);

    return true;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash,
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException('Invalid old password');
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userService.UpdateUser(user);
    return true;
  }

  async verifyEmail(userId: string): Promise<boolean> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.emailVerified = true;
    await this.userService.UpdateUser(user);
    return true;
  }

  async logout(@Req() request: Request): Promise<boolean> {
    // Extract the authentication token from the request, assuming it's stored in headers or cookies
    const authToken =
      request.headers.authorization || request.cookies['yourAuthToken'];

    if (!authToken) {
      throw new BadRequestException('No authentication token found');
    }

    // Implement your logout logic based on your authentication mechanism
    // For example, you might revoke the token, remove it from a session store, or perform other cleanup actions
    this.jwtAuthService.invalidateToken(authToken);
    // Optionally, you may want to clear cookies or perform additional actions based on your authentication strategy.

    return true;
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
