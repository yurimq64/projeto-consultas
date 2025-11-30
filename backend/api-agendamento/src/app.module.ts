import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConsultasModule } from './consultas/consultas.module';

@Module({
  imports: [PacientesModule, PrismaModule, AuthModule, ConsultasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
