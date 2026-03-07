import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sign } from 'crypto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login (@Body() signUpDto: any){
        return this.authService.signIn(signUpDto.email, signUpDto.password);
    }
    @Post('register') 
  async register(@Body() signUpDto: any) {
    
    return this.authService.signUp(signUpDto);
  }
}
