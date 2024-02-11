import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [TransactionService],
  imports: [UserModule],
  exports: [TransactionService],
})
export class TransactionModule {}
