import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
  getHello(): string {
    return 'Server Connected!';
  }
}
