import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PacientesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
