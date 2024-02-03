import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramOptions } from 'src/types/telegram';
import { Telegraf } from 'telegraf';
import { TELEGRAM_MODULE } from './telegram.constants';

@Injectable()
export class TelegramService implements OnModuleInit {
  bot: Telegraf;
  options: TelegramOptions;

  constructor(@Inject(TELEGRAM_MODULE) options: TelegramOptions) {
    this.bot = new Telegraf(options.token);
    this.options = options;
  }

  onModuleInit() {
    this.sendMessage('Бот на связи!');
  }

  async sendMessage(message: string, chatId = this.options.chatId) {
    return this.bot.telegram.sendMessage(chatId, message);
  }
}
