import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from 'src/providers/services/user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('portfolio')
  getProfile(@Request() req) {
    return req.user;
  }
}
