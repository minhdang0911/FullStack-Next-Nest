import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    
    @IsNotEmpty({message:'email không được để trống'})
    email: string;
    @IsNotEmpty({message:'password không được để trống'})
    password: string;
    @IsOptional()
    name:string
} 



export class CodeAuthDto {
    
    @IsNotEmpty({message:'id không được để trống'})
    _id: string;
    @IsNotEmpty({message:'code không được để trống'})
    code: string;
     
}



export class changePasswordAuthDto  {
    
    @IsNotEmpty({message:'code không được để trống'})
    code: string;
    @IsNotEmpty({message:'password không được để trống'})
    password: string;
    @IsNotEmpty({message:'mật khẩu xác nhận không được để trống'})
    confirmPassword: string;
    @IsNotEmpty({message:'emailxác nhận không được để trống'})
    email: string;
     
}