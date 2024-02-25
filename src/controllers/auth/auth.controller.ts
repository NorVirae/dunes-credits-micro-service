import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
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
import { AuthGuard } from './auth.guard';

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
      if (!userData.email || !userData.password)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.authService.register(userData);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
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
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message, err.statusCode);
    }
  }

  // Reset password route

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('resetToken') resetToken: string,
    @Body('newPassword') newPassword: string,

    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const responseData = await this.authService.resetPassword(
        email,
        resetToken,
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

  @UseGuards(AuthGuard)
  // change password route
  @Post('change-password')
  async changePassword(
    @Req() request: Request,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const userId = request['user'].id;
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
  @Get('verify-email')
  async verifyEmail(
    @Param('email') email: string,
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
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean | null>> {
    try {
      const authToken = request['user'].token;

      const responseData = await this.authService.logout(authToken);
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
