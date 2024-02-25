import { Injectable } from '@nestjs/common';
import { MessageHelper } from '../helpers/messages.helpers';
import { User } from 'src/models/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'src/models/transaction.model';

@Injectable()
export class CreditsService {
  constructor(
    private messagehelper: MessageHelper,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async transferCredits(
    senderEmail: string,
    receiverEmail: string,
    amount: number,
  ): Promise<string> {
    // Placeholder: Implement logic to check if sender has enough credits
    const sender = await this.userModel.findOne({ email: senderEmail });
    const receiver = await this.userModel.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return 'Invalid sender or receiver';
    }

    if (sender.credits < amount) {
      return 'Insufficient credits';
    }

    // Calculate transaction fee (you can customize this logic)
    const transactionFee = (5 / 100) * amount; // 5% transaction fee

    // Deduct credits from the sender (including transaction fee)
    sender.credits -= amount + transactionFee;
    await sender.save();

    // Add credits to the receiver
    receiver.credits += amount;
    await receiver.save();

    // Create a transaction record
    const transaction = new this.transactionModel({
      senderEmail,
      receiverEmail,
      amount,
      transactionFee,
      isSuccessful: true,
    });
    await transaction.save();

    return 'Credit transfer successful!';
  }

  async fetchCreditsBalance(email: string): Promise<number> {
    const user = await this.userModel.findOne({ email });
    return user ? user.credits : 0;
  }

  async fetchTransactions(userEmail: string): Promise<any[]> {
    try {
      // Placeholder: Implement your logic to fetch notifications from the database
      const transactions = await this.transactionModel
        .find({
          $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }],
        })
        .exec();
      return transactions;
    } catch (error) {
      console.error(`Fetching notifications failed: ${error.message}`);
      throw new Error('Fetching notifications failed');
    }
  }
}
