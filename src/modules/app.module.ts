import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '../controllers/app/app.controller';
import { AppService } from '../providers/services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import * as Joi from 'joi';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { CreditsModule } from './credits.module';
import { UserController } from 'src/controllers/user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/controllers/auth/auth.guard';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CreditsModule,
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_USER: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],

      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<string>('database.dbURI'), 'DB PASS');
        return {
          uri: configService.get<string>('database.dbURI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
