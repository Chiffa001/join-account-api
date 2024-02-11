import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

export const getTelegramConfig = (
  configService: ConfigService,
): TelegrafModuleOptions => {
  return {
    token: configService.getOrThrow('TG_TOKEN'),
    middlewares: [session()],
  };
};
