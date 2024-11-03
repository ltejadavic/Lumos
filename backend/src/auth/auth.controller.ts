import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from './entities/role.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    const { email, password, nombre, apellidos, telefono, colegio, universidad, distrito, provincia, ciudad, pais, role } = body;
  
    const newUser = await this.authService.createUser(
      { email, password, nombre, apellidos, telefono, colegio, universidad, distrito, provincia, ciudad, pais },
      role  // Enviar el nombre del rol aquí
    );
    
    return { message: 'User registered successfully', user: newUser };
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.findUser(body.email);
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

  @Get('roles')
  async getRoles(): Promise<Role[]> {
    return this.authService.getRoles();
    }
}