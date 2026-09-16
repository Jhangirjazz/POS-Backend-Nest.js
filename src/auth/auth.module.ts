import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key-change-later', // Change this in real life
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService , JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}