import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if(!user ) return null;
    const isValidPassword = await comparePasswordHelper(pass,user.password)
    if( !isValidPassword) return null;
    return user;
 
  }

  async login(user: any){
    const payload = { username: user.email, sub: user._id };
    return {
      user:{
        email:user.email,
        _id:user._id,
        name:user.name
      },
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  handleRegister = async(registerDto: CreateAuthDto) =>{
      return await this.usersService.handleRegister(registerDto)
  }

  checkCode = async(data: CodeAuthDto) =>{
      return await this.usersService.handleActive(data)
  }

  retryActive = async(data: string) =>{
      return await this.usersService.retryActive(data)
  }


//   async signIn(username: string, pass: string): Promise<any> {
//     const user = await this.usersService.findByEmail(username);
//     const isValidPassword = await comparePasswordHelper(pass,user.password)
//     if ( !isValidPassword) {
//       throw new UnauthorizedException("tài khoản hoặc mật khẩu không hợp lệ");
//     }
//  const payload = { sub: user._id, username: user.email };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     }
     
//   }
}
