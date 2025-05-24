import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { changePasswordAuthDto, CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService
  ){}

   @Post("login")
   @Public()
   @UseGuards(LocalAuthGuard)
   @ResponseMessage("fetch login")
   handleLogin(@Request() req) {
      return this.authService.login(req.user);
   }
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto)
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto)
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body("email") email: string ) {
    return this.authService.retryActive(email)
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body("email") email: string ) {
    return this.authService.retryPassword(email)
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data:changePasswordAuthDto ) {
    return this.authService.changePassword(data)
  }
  
  
  
  
  
  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
      .sendMail({
        to: 'minhdanglove3q@gmail.com', 
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template:"register",
        context:{
          name:'dang',
          activationCode:'123-23213-21321'
        }
      })
    return "test";
  }
}
