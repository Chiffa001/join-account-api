import { Injectable } from '@nestjs/common';
import { TransactionData } from 'src/types/transaction';
import { Debtor } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TransactionService {
  constructor(private readonly userService: UserService) {}

  async setDebt({ ownerId, debtorId, sum }: TransactionData) {
    const owner = await this.userService.getByTgId(ownerId);
    const debtor = await this.userService.getByTgId(debtorId);

    // Уже должен какую-то сумму
    const alreadyExistDebt = debtor?.debtOwners.find(
      ({ tgId, sum }) => tgId === ownerId && sum > 0,
    );

    if (alreadyExistDebt) {
      const newSum = alreadyExistDebt.sum + sum;
      await this.userService.updateByTgId(ownerId, {
        debtOwners: owner?.debtOwners.map((user) =>
          user.tgId !== debtorId ? { tgId: user.tgId, sum: newSum } : user,
        ),
        debtors: owner?.debtors.map((user) =>
          user.tgId === debtorId ? { tgId: user.tgId, sum: newSum } : user,
        ),
      });

      await this.userService.updateByTgId(debtorId, {
        debtors: debtor?.debtors.map((user) =>
          user.tgId !== debtorId ? { tgId: user.tgId, sum: newSum } : user,
        ),
        debtOwners: debtor?.debtOwners.map((user) =>
          user.tgId === ownerId ? { tgId: user.tgId, sum: newSum } : user,
        ),
      });

      return this.userService.getByTgId(ownerId);
    }

    const ownerInDebts = debtor?.debtors.find(
      ({ tgId, sum }) => tgId === ownerId && sum > 0,
    );

    if (!ownerInDebts) {
      // Никто никому раньше не должен был
      await this.userService.updateByTgId(ownerId, {
        debtors: [...(owner?.debtors as Debtor[]), { tgId: debtorId, sum }],
      });

      await this.userService.updateByTgId(debtorId, {
        debtOwners: [
          ...(debtor?.debtOwners as Debtor[]),
          { tgId: ownerId, sum },
        ],
      });

      return this.userService.getByTgId(ownerId);
    }

    // текущий пользователь в долгах перед другим
    if (ownerInDebts.sum > sum) {
      await this.userService.updateByTgId(ownerId, {
        debtOwners: owner?.debtOwners.map((user) =>
          user.tgId === debtorId
            ? { tgId: user.tgId, sum: user.sum - sum }
            : user,
        ),
      });
      await this.userService.updateByTgId(debtorId, {
        debtors: debtor?.debtors.map((user) =>
          user.tgId === ownerId
            ? { tgId: user.tgId, sum: user.sum - sum }
            : user,
        ),
      });
    } else if (ownerInDebts.sum === sum) {
      await this.userService.updateByTgId(ownerId, {
        debtOwners: owner?.debtOwners.filter((user) => user.tgId !== debtorId),
        debtors: owner?.debtors.filter((user) => user.tgId !== debtorId),
      });
      await this.userService.updateByTgId(debtorId, {
        debtors: debtor?.debtors.filter((user) => user.tgId !== ownerId),
        debtOwners: debtor?.debtOwners.filter((user) => user.tgId !== ownerId),
      });
    } else {
      const newSum = Math.abs(ownerInDebts.sum - sum);

      await this.userService.updateByTgId(ownerId, {
        debtOwners: owner?.debtOwners.filter((user) => user.tgId !== debtorId),
        debtors: [
          ...(owner?.debtors as Debtor[]),
          { tgId: debtorId, sum: newSum },
        ],
      });
      await this.userService.updateByTgId(debtorId, {
        debtors: debtor?.debtors.filter((user) => user.tgId !== ownerId),
        debtOwners: [
          ...(debtor?.debtOwners as Debtor[]),
          { tgId: ownerId, sum: newSum },
        ],
      });
    }
    return this.userService.getByTgId(ownerId);
  }
}
