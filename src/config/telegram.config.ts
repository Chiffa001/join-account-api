import { ConfigService } from '@nestjs/config';
import { TelegramOptions } from 'src/types/telegram';

export const getTelegramConfig = (
  configService: ConfigService,
): TelegramOptions => {
  return {
    token: configService.getOrThrow('TG_TOKEN'),
    chatId: configService.getOrThrow('TG_CHAT_ID'),
  };
};
