import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any): Promise<any> {
    // Validate user from payload (e.g., check database)
    return { userId: payload.sub, username: payload.username };
  }
}
