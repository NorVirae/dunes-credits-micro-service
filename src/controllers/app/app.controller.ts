import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from '../../providers/app.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): { name: string } {
    const responseData = this.appService.getHello();
    response.statusCode = 400;
    return { name: responseData };
  }
}
