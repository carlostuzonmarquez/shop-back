import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const user = { userId: 1, username: 'admin', password: 'admin' };
    if (
      credentials.username === user.username &&
      credentials.password === user.password
    ) {
      return user;
    }
    return null;
  }
}
