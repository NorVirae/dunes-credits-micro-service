import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from '../../providers/services/app.service';
import { AuthService } from 'src/providers/services/auth.service';
import {
  IMessageResponse,
  IUserLoginRequestData,
  IUserLoginResponseData,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register route
  @Post('register')
  async register(
    @Body() userDto: IUserRegisterRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserRegisterResponseData | null>> {
    const responseData = this.authService.register(userDto);
    response.statusCode = 400;
    return responseData;
  }

  // login route
  @Post('login')
  async login(
    @Body() userLogin: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const responseData = await this.authService.login(userLogin);
    response.statusCode = responseData.statusCode;
    return responseData;
  }

  // Forgotten password route
  @Post('forgotten-password')
  async forgottenPassword(
    @Body() userLogin: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const responseData = await this.authService.forgottenPassword(userLogin);
    response.statusCode = responseData.statusCode;
    return responseData;
  }

  // Reset password route
  @Post('reset-password')
  async resetPassword(
    @Body() userLogin: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const responseData = await this.authService.resetPassword(userLogin);
    response.statusCode = responseData.statusCode;
    return responseData;
  }

  // change password route
  @Post('change-password')
  async changePassword(
    @Body() userLogin: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const responseData = await this.authService.changePassword(userLogin);
    response.statusCode = responseData.statusCode;
    return responseData;
  }

  // verify email route
  @Post('verify-email')
  async verifyEmail(
    @Body() userLogin: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const responseData = await this.authService.verifyEmail(userLogin);
    response.statusCode = responseData.statusCode;
    return responseData;
  }

  // logout route
  @Post('logout')
  async logout(
    @Body() userLogin: IUserLoginRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<IUserLoginResponseData | null>> {
    const responseData = await this.authService.logout(userLogin);
    response.statusCode = responseData.statusCode;
    return responseData;
  }
}
