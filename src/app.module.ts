import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
