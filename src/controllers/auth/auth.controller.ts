import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from '../../providers/services/app.service';
import { AuthService } from 'src/providers/services/auth.service';
import {
  IMessageResponse,
  IUserLoginRequestData,
  IUserLoginResponseData,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';
import { Response, Request } from 'express';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageHelper: MessageHelper,
  ) {}

  // register route
  @Post('register')
  async register(
    @Body() userData: IUserRegisterRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
    try {
      if (!userData.email || !userData.name || !userData.password)
        throw new BadRequestException('Invalid Inputs');
      const responseData = this.authService.register(userData);
      response.statusCode = 400;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode;
      this.messageHelper.ErrorResponse(err.message);
    }
  }

  // login route
  @Post('login')
  async login(
    @Body() userLogin: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    try {
      const responseData = await this.authService.login(userLogin);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode;
      this.messageHelper.ErrorResponse(err.message);
    }
  }

  // Forgotten password route
  @Post('forgotten-password')
  async forgottenPassword(
    @Body('email') email: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.forgottenPassword(email);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      response.statusCode = err.statusCode;
      return this.messageHelper.ErrorResponse(err.message, err.statusCode);
    }
  }

  // Reset password route
  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,

    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.resetPassword(
        email,
        token,
        newPassword,
      );
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse(
        'E-mail Reset successful!',
        responseData,
      );
    } catch (err) {
      response.statusCode = err.statusCode;
      this.messageHelper.ErrorResponse(err.message, err.statusCode);
    }
  }

  // change password route
  @Post('change-password')
  async changePassword(
    @Body('userId') userId: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      if (!userId || !oldPassword || !newPassword) {
        throw new BadRequestException('Invalid Inputs');
      }
      const responseData = await this.authService.changePassword(
        userId,
        oldPassword,
        newPassword,
      );
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse(
        'Password Reset Successful',
        responseData,
      );
    } catch (err) {
      response.statusCode = err.statusCode;
      return this.messageHelper.ErrorResponse(err.message, err.statusCode);
    }
  }

  // verify email route
  @Post('verify-email')
  async verifyEmail(
    @Body('email') email: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.verifyEmail(email);
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse(
        'Email-verification Successfull',
        responseData,
      );
    } catch (err) {
      response.statusCode = err.statusCode;
      return this.messageHelper.ErrorResponse(err.message, err.statusCode);
    }
  }

  // logout route
  @Post('logout')
  async logout(
    @Body() userLogin: IUserLoginRequestData,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.logout(request);
      const authToken =
        request.headers.authorization || request.cookies['yourAuthToken'];
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse(
        'Logout Successful!',
        responseData,
      );
    } catch (err) {
      response.statusCode = err.statusCode;
      return this.messageHelper.ErrorResponse(err.message, err.statusCode);
    }
  }
}
