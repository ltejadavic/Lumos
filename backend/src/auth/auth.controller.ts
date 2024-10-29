import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    const hashedPassword = await this.authService.hashPassword(body.password);
    // Guarda el usuario en la base de datos con hashedPassword, por ejemplo:
    const newUser = this.authService.createUser({ ...body, password: hashedPassword });
    return { message: 'User registered successfully', user: newUser };
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.findUser(body.username);
    if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await this.authService.comparePasswords(body.password, user.password);
    if (isPasswordMatching) {
        return { access_token: (await this.authService.generateToken(user)).access_token };
    } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    }
}