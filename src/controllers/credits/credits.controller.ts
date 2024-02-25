// credit.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CreditsService } from 'src/providers/services/credits.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditService: CreditsService) {}

  @UseGuards(AuthGuard) // Use JWT authentication guard to protect this route
  @Post('transfer')
  async transferCredits(
    @Req() request: any,
    @Body('receiverEmail') receiverEmail: string,
    @Body('amount') amount: number,
  ) {
    try {
      // Extract the sender's email from the authenticated user
      const senderEmail = request.user.email;

      // Call the CreditService to handle the credit transfer
      await this.creditService.transferCredits(
        senderEmail,
        receiverEmail,
        amount,
      );

      return { message: 'Credit transfer successful' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Credit transfer failed');
    }
  }

  @UseGuards(AuthGuard) // Use JWT authentication guard to protect this route
  @Get('balance')
  async fetchCreditsBalance(@Req() request: any) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request.user.email;

      // Call the CreditService to fetch the user's balance
      const balance = await this.creditService.fetchCreditsBalance(userEmail);

      return { balance };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching balance failed');
    }
  }

  async fetchNotifications(@Req() request: any) {
    try {
      // Extract the user's email from the authenticated user
      const userEmail = request.user.email;

      // Call the NotificationService to fetch notifications
      const transactions =
        await this.creditService.fetchTransactions(userEmail);

      return transactions;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching notifications failed');
    }
  }
}
