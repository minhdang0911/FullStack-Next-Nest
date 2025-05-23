import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { changePasswordAuthDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if(user) return true;
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    
    //check email exist
    const isExist = await this.isEmailExist(email)
    if(isExist){
      throw new BadGatewayException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác`)
    }

   
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    
    return {
      _id: user._id,
    };
  }

  async findAll(query: string,current: number, pageSize: number) {
    const {filter,sort} = aqp(query);
    if(filter.current) delete filter.current
    if(filter.pageSize) delete filter.pageSize
    if(!current) current=1;
    if(!pageSize) pageSize=10;
    
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize)
    const skip = (+current -1) * (pageSize)
    const results = await this.userModel.find(filter).limit(pageSize).skip(skip).select("-password").sort(sort as any);
    return {
      meta:{
        current:current,
        pageSize:pageSize,
        pages:totalPages,
        total:totalItems,
      },
      results
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  
  async findByEmail (email: string){
    return await this.userModel.findOne({email});
  }

  async update( updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {_id: updateUserDto._id},{...updateUserDto}
    )
  }

  async remove(_id: string) {
    if(mongoose.isValidObjectId(_id)){
       return this.userModel.deleteOne({_id})
    }else{
      throw new BadGatewayException("Id không đúng định dạng")
    }
  }

  async handleRegister(registerDto :CreateAuthDto) {
    const { name, email, password} = registerDto;
    
    //check email exist
    const isExist = await this.isEmailExist(email)
    if(isExist){
      throw new BadGatewayException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác`)
    }

   
    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4()
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive:false,
      codeId : codeId ,
      codeExpired:dayjs().add(5,'minutes'),
    });
    this.mailerService.sendMail({
        to: user.email ,
        subject: 'Kích hoạt tài khoản để đăng nhập', // Subject line
        template:"register",
        context:{
          name:user.name ?? user.email,
          activationCode:codeId
        }
    })
    return {
      _id: user._id
    }
  }

  async handleActive(data : CodeAuthDto) {
    const user= await this.userModel.findOne({
      _id:data._id,
      codeId: data.code
    })
    if(!user){
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn");
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if(isBeforeCheck){
      await this.userModel.updateOne({_id:data._id},{
        isActive:true
      })
    return {isBeforeCheck};
    }else{
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn");
    }
    
  }

  async retryActive (email: string){
    const user = await this.userModel.findOne({email})
    const codeId = uuidv4()
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if(user.isActive){
       throw new BadRequestException("Tài khoản đã được kích hoạt")
    }
    await user.updateOne({
      codeId : codeId ,
      codeExpired:dayjs().add(5,'minutes'),
    })

    this.mailerService.sendMail({
        to: user.email ,
        subject: 'Kích hoạt tài khoản để đăng nhập',  
        template:"retryEmail",
        context:{
          name:user.name ?? user.email,
          activationCode:codeId
        }
    })
    return {_id:user._id}
  }


   async retryPassword (email: string){
    const user = await this.userModel.findOne({email})
    const codeId = uuidv4()
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    
    // if(user.isActive){
    //    throw new BadRequestException("Tài khoản đã được kích hoạt")
    // }
    await user.updateOne({
      codeId : codeId ,
      codeExpired:dayjs().add(5,'minutes'),
    })

    this.mailerService.sendMail({
        to: user.email ,
        subject: 'Quên mật khẩu',  
        template:"forgotPassword",
        context:{
          name:user.name ?? user.email,
          activationCode:codeId
        }
    })
    return {_id:user._id,email:user.email}
  }


  async changePassword (data: changePasswordAuthDto){
    if(data.confirmPassword !== data.password){
      throw new BadRequestException("Mật khảu và mật khẩu xác nhận không chính xác")
    }
    const user = await this.userModel.findOne({email:data.email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại")
    }
     const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if(isBeforeCheck){
      const newPassword= await hashPasswordHelper(data.password)
      await user.updateOne({password:newPassword})
      return {isBeforeCheck};
    }else{
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn");
    }
    
    // if(user.isActive){
    //    throw new BadRequestException("Tài khoản đã được kích hoạt")
    // }
   
    return {_id:user._id,email:user.email}
  }

}
