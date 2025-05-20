import { IsEmail, isNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
  phone: string;
  address: string;
  image: string;
}
