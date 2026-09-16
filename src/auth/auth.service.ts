import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ 
      where: { email: dto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('Email already taken');
    }
    
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Make Store first
    const store = await this.prisma.store.create({
      data: {
        name: dto.storeName,
      },
    });

    // Make User and connect to Store
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        storeId: store.id,
        role: 'ADMIN',
      },
    });
    
    return { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      storeId: store.id 
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ 
      where: { email: dto.email },
      include: { store: true },
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      storeId: user.storeId,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        store: user.store,
      }
    };
  }
}