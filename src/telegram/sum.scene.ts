import { Injectable } from '@nestjs/common';
import { Command, Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  INPUT_SUM_ERROR_MESSAGE,
  SUM_SCENE_ENTER_MESSAGE,
} from 'src/constants/telegram';
import { SceneContext } from 'telegraf/typings/scenes';
import { commands } from './telegram.constants';

@Injectable()
@Scene('sumScene')
export class SumScene {
  @SceneEnter()
  async enter(@Ctx() context: SceneContext) {
    context.sendMessage(SUM_SCENE_ENTER_MESSAGE);
  }

  @Command(commands.addSum.command)
  command(@Ctx() context: SceneContext) {
    context.scene.reenter();
  }

  @On('text')
  onAnswer(@Ctx() context: SceneContext, @Message('text') msg: string) {
    try {
      const sum = Number(msg);
      if (Number.isNaN(sum) || sum <= 0) {
        throw new Error('Not number');
      }
      context.scene.enter('personScene', {
        sum,
        userId: context.message?.from.id,
      });
    } catch {
      context.sendMessage(INPUT_SUM_ERROR_MESSAGE);
      context.scene.reenter();
    }
  }
}
