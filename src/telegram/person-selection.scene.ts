import { Injectable } from '@nestjs/common';
import { InlineKeyboardButton } from '@telegraf/types';
import { Action, Command, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  EMPTY_USER_LIST_MESSAGE,
  PAID_DEBT_MESSAGE,
  PERSON_SELECTION_MESSAGE,
} from 'src/constants/telegram';
import { commands } from 'src/telegram/telegram.constants';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionData } from 'src/types/transaction';
import { UserService } from 'src/user/user.service';
import { isArrayWithItems } from 'src/utils/array';
import { Update } from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';

@Injectable()
@Scene('personScene')
export class PersonScene {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  @Command(commands.addSum.command)
  command(@Ctx() context: SceneContext) {
    context.scene.leave();
  }

  @SceneEnter()
  async enter(@Ctx() context: SceneContext) {
    const state = context.scene.session.state as {
      sum: number;
      userId: number;
    };
    const users = await this.userService.getAll(state.userId);

    if (!isArrayWithItems(users)) {
      context.reply(EMPTY_USER_LIST_MESSAGE);
      context.scene.leave();
      return;
    }

    if (users.length === 1) {
      const { tgId } = users[0];
      await this.doTransaction(context, {
        ownerId: state.userId,
        sum: state.sum,
        debtorId: tgId,
      });
      return;
    }

    const userButtonsInfo: InlineKeyboardButton[][] = users.map(
      ({ tgId, name }) => [{ text: name, callback_data: String(tgId) }],
    );

    context.reply(PERSON_SELECTION_MESSAGE, {
      reply_markup: {
        inline_keyboard: userButtonsInfo,
      },
    });
  }

  @Action(/.*/)
  async onAnswer(
    @Ctx() context: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const state = context.scene.session.state as {
      sum: number;
      userId: number;
    };
    const debtorId = Number(
      (context.update.callback_query as { data: string }).data,
    );

    await this.doTransaction(context, {
      ownerId: state.userId,
      sum: state.sum,
      debtorId,
    });
  }

  private async doTransaction(context: SceneContext, data: TransactionData) {
    const owner = await this.transactionService.setDebt(data);

    const currentUserInDebtors = owner?.debtOwners.find(
      ({ tgId }) => tgId === data.debtorId,
    );
    if (currentUserInDebtors) {
      const debtOwner = await this.userService.getByTgId(data.debtorId);
      context.sendMessage(
        `Вы должны пользователю "${debtOwner?.name}" ${currentUserInDebtors.sum}`,
      );
    } else {
      const searchedDebtor = owner?.debtors.find(
        ({ tgId }) => tgId === data.debtorId,
      );

      if (searchedDebtor) {
        const debtor = await this.userService.getByTgId(searchedDebtor.tgId);
        context.sendMessage(
          searchedDebtor.sum !== 0
            ? `Пользователь "${debtor?.name}" должен Вам ${searchedDebtor.sum}`
            : PAID_DEBT_MESSAGE,
        );
      } else {
        context.sendMessage(PAID_DEBT_MESSAGE);
      }
    }
    context.scene.leave();
  }
}
