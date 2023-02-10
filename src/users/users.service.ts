import { UsersRepository } from './users.repository';
import { UserRequestDto } from './dto/users.request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    //중복 방지하자 (유효성 검사를 하자 )
    const isUserExist = await this.usersRepository.existsByEmail(email);
    if (isUserExist) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
    }
    //비밀번호 암호화를 하자 bycript=> hash를 해준다.(설치해야 함)
    const hashedPassword = await bcrypt.hash(password, 10);

    //본격적으로 저장을 하자
    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }
}
