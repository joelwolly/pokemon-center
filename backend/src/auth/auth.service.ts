import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; 
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: any) {
    const { email } = signUpDto;

   
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    return this.userService.create(signUpDto); 
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    
    throw new UnauthorizedException('Credenciais inválidas');
  }
}