import { Injectable } from '@nestjs/common';
import { Command, Ctx, Update } from 'nestjs-telegraf';
import { commands } from './telegram.constants';
import { SceneContext } from 'telegraf/typings/scenes';
import { UserService } from 'src/user/user.service';
import { NOT_SUCH_USER_MESSAGE } from 'src/constants/telegram';

@Update()
@Injectable()
export class TelegramService {
  constructor(private readonly userService: UserService) {}

  @Command(commands.addSum.command)
  async addSum(@Ctx() ctx: SceneContext) {
    const tgId = ctx.message?.from.id as number;

    const user = await this.userService.isThereSuchUser(tgId);

    if (!user) {
      ctx.sendMessage(NOT_SUCH_USER_MESSAGE);
      return;
    }

    ctx.scene.enter('sumScene');
  }
}
