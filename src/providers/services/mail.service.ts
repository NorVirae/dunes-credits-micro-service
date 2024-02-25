// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create a Nodemailer transporter using your email service provider's SMTP details
    this.transporter = nodemailer.createTransport({
      host: 'smtp.privateemail.com', // Replace with your SMTP host
      port: 587, // Replace with your SMTP port
      type: 'TLS',
      secure: false, // Set to true if your SMTP server uses SSL
      auth: {
        user: 'vyra@techsprinthub.com', // Replace with your email address
        pass: 'Nor25rt', // Replace with your email password
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    verificationLink: string,
  ): Promise<void> {
    try {
      // Send a verification email using Nodemailer
      await this.transporter.sendMail({
        from: 'vyra@techsprinthub.com', // Replace with your email address
        to,
        subject: 'Account Verification',
        text: `Click the following link to verify your account: https://credit-sprints.herokuapp.com/verify?token=${verificationLink}`,
      });

      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error(`Verification email sending failed: ${error.message}`);
      throw new Error('Verification email sending failed');
    }
  }

  async sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
    try {
      // Send a reset password email using Nodemailer
      await this.transporter.sendMail({
        from: 'vyra@techsprinthub.com', // Replace with your email address
        to,
        subject: 'Reset Password',
        text: `Click the following link to reset your password: https://credit-sprints.vercel.com/forgotten/?token=${resetLink}`,
      });

      console.log(`Reset password email sent to ${to}`);
    } catch (error) {
      console.error(`Reset password email sending failed: ${error.message}`);
      throw new Error('Reset password email sending failed');
    }
  }

  async sendCreditTransferEmail(
    sender: string,
    receiver: string,
    amount: number,
  ): Promise<void> {
    try {
      const emailContent = `
        <p>Dear ${receiver},</p>
        <p>You have received a credit transfer from ${sender}.</p>
        <p>Amount: ${amount}</p>
        <p>Thank you for using our service!</p>
      `;

      // Send the credit transfer email using Nodemailer
      await this.transporter.sendMail({
        from: 'vyra@techsprinthub.com', // Replace with your email address
        to: receiver,
        subject: 'Credit Transfer Notification',
        html: emailContent,
      });

      console.log(`Credit transfer email sent to ${receiver}`);
    } catch (error) {
      console.error(`Credit transfer email sending failed: ${error.message}`);
      throw new Error('Credit transfer email sending failed');
    }
  }
}
