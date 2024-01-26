import { Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
  ) {}

  async getAll() {
    return this.userModel.find().exec();
  }
}
