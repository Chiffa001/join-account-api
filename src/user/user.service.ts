import { Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    // @ts-expect-error
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
  ) {}

  async getAll(id?: number) {
    return this.userModel.find({ tgId: { $ne: id } }).exec();
  }

  async getByTgId(tgId: number) {
    return this.userModel.findOne({ tgId });
  }

  async create(dto: CreateUserDto) {
    return this.userModel.create(dto);
  }

  async updateByTgId(tgId: number, data: Partial<UserModel>) {
    return this.userModel.updateOne({ tgId }, data);
  }

  async resetAll() {
    await this.userModel.updateMany(
      {},
      {
        debtors: [],
        debtOwners: [],
      },
    );
  }

  async isThereSuchUser(tgId: number) {
    return this.userModel.exists({ tgId });
  }
}
