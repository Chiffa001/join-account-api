import { BotCommand } from 'telegraf/typings/core/types/typegram';

export const TELEGRAM_MODULE = 'TELEGRAM_MODULE';

const COMMANDS_NAME = {
  addSum: 'add_sum',
};

export const commands: Record<keyof typeof COMMANDS_NAME, BotCommand> = {
  addSum: {
    command: COMMANDS_NAME.addSum,
    description: 'Добавить новую сумму',
  },
};
