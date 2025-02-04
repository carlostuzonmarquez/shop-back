/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    // Validate credentials (e.g., check database)
    const user = await this.validateCredentials(credentials);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.authService.generateToken(payload),
    };
  }

  private async validateCredentials(credentials: {
    username: string;
    password: string;
  }): Promise<any> {
    const user = await this.userService.findByEmail(credentials.username);
    const isValidPassword = await argon2.verify(
      user.password,
      credentials.password,
    );
    if (credentials.username === user.username && isValidPassword) {
      return user;
    }
    return null;
  }
}
