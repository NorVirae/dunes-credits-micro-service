import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from '../../providers/services/app.service';
import { Request, Response } from 'express';
import { AuthService } from 'src/providers/services/auth.service';
import {
  IMessageResponse,
  IUserRegisterRequestData,
  IUserRegisterResponseData,
} from 'src/interfaces';

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
  login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): { name: string } {
    const responseData = this.authService.login();
    response.statusCode = 400;
    return { name: responseData };
  }
}
