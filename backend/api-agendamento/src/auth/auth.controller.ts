import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // 1. Verifica se a senha bate
    const user = await this.authService.validateUser(body.email, body.senha);
    
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // 2. Se bateu, entrega o token
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }
}