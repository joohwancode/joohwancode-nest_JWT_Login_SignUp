import { UserRequestDto } from './dto/users.request.dto';
import { User } from './users.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  //request 유저에 저장할때 패스워드만 빼고 저장
  async findUserByIdWithoutPassword(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }
  //로그인시 이메일 확인
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    if (result) return true;
    else return false;
  }
  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }
}
