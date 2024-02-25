import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  getHello(): string {
    return 'Server Connected!';
  }
}
