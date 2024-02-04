import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

export class Debtor {
  @prop()
  tgId: number;

  @prop()
  sum: number;
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @prop()
  name: string;

  @prop({ unique: true })
  tgId: number;

  @prop({ type: () => [Debtor], default: [] })
  debtors: Debtor[]; // кто должен

  @prop({ type: () => [Debtor], default: [] })
  debtOwners: Debtor[]; // кому должен
}
