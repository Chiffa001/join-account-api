import { Global, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SumScene } from './sum.scene';
import { PersonScene } from './person-selection.scene';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';
@Global()
@Module({
  providers: [TelegramService, SumScene, PersonScene],
  imports: [UserModule, TransactionModule],
})
export class TelegramModule {}
