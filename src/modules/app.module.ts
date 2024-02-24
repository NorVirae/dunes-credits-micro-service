import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app/app.controller';
import { AppService } from '../providers/app.service';
import { AuthController } from '../controllers/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import * as Joi from 'joi';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { WalletModule } from './wallet.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    WalletModule,
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
