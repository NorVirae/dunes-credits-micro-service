import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from 'src/providers/services/auth.service';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { MailService } from 'src/providers/services/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      global: true,
      useFactory: async (configservice: ConfigService) => {
        return {
          signOptions: { expiresIn: '14400s' }, //aproximately 4 hours
          secret: configservice.get<string>('auth.jwtSecret'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MessageHelper, MailService],
})
export class AuthModule {}
