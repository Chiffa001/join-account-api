import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './config/mongo.config';
import { UserModule } from './user/user.module';
import { getTelegramConfig } from './config/telegram.config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramModule } from './telegram/telegram.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UserModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
    TelegramModule,
    GracefulShutdownModule.forRoot(),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
