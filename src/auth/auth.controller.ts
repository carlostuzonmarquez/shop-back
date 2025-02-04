/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    // Validate credentials (e.g., check database)
    const user = await this.validateCredentials(credentials);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.authService.generateToken(payload),
    };
  }

  private async validateCredentials(credentials: {
    username: string;
    password: string;
  }): Promise<any> {
    // Replace with actual user validation logic
    const user = await this.userService.findByEmail(credentials.username);
    const encodedPassword = await argon2.hash(credentials.password);
    console.log(credentials.password)
    console.log(encodedPassword)
    console.log(user.password)
    if (
      credentials.username === user.username &&
      encodedPassword === user.password
    ) {
      return user;
    }
    return null;
  }
}
