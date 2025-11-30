import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConsultasModule } from './consultas/consultas.module';
import { LocaisModule } from './locais/locais.module';

@Module({
  imports: [PacientesModule, PrismaModule, AuthModule, ConsultasModule, LocaisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
