import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(data: any) {
    const { nom, prenom, email, password } = data;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email déjà utilisé');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.usersService.create({
      nom,
      prenom,
      email,
      passwordHash,
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(data: any) {
    const { email, password, rememberMe } = data;
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Identifiants incorrects ou compte inactif');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Identifiants incorrects ou compte inactif');
    }

    const payload = { email: user.email, sub: user.id };
    
    // Si rememberMe est coché, token valide 7 jours, sinon 1 jour
    const expiresIn = rememberMe ? '7d' : '1d';

    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        isActive: user.isActive
      }
    };
  }
}
