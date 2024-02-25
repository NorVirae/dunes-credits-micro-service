import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/providers/services/user.service';
import { AuthGuard } from '../auth/auth.guard';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { Request, Response, response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private messageHelper: MessageHelper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('portfolio')
  async getProfile(@Req() request: Request, @Res() response: Response) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request['user'].email;

      // Call the NotificationService to fetch notifications
      const transactions = await this.userService.findOneByEmail(userEmail);
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse(
        'Retrieval Successful',
        transactions,
      );
    } catch (err) {
      console.error(err);
      response.statusCode = err.message;
      throw new BadRequestException('Fetching notifications failed');
    }
  }

  @Get('show:id')
  async showUser(
    @Param('id') id: string,
    request: Request,
    @Res() response: Response,
  ) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request['user'].email;

      // Call the NotificationService to fetch notifications
      const transactions = await this.userService.findOneByEmail(userEmail);
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse(
        'Retrieval Successful',
        transactions,
      );
    } catch (err) {
      console.error(err);
      response.statusCode = err.message;
      throw new BadRequestException('Fetching notifications failed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('update')
  async UpdateUser(@Req() request: Request, @Res() response: Response) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request['user'].email;

      // Call the NotificationService to fetch notifications
      const transactions = await this.userService.UpdateUser(userEmail);
      response.statusCode = 201;
      return this.messageHelper.SuccessResponse(
        'User Updated Successfully',
        transactions,
      );
    } catch (err) {
      console.error(err);
      response.statusCode = err.message;
      throw new BadRequestException('Fetching notifications failed');
    }
  }

  // no protection: intentional
  @Get('fetch-all-users')
  async findAllUsers(@Req() request: any) {
    try {
      // Extract the user's email from the authenticated user

      // Call the NotificationService to fetch notifications
      const transactions = await this.userService.findAllUsers();

      return transactions;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching notifications failed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('delete-user')
  async deleteUser(@Req() request: Request) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request['user'].email;

      // Call the NotificationService to fetch notifications
      const transactions = await this.userService.deleteUser(userEmail);

      return transactions;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching notifications failed');
    }
  }
}
