import { Module } from '@nestjs/common';
import { MarcheService } from './marche.service';
import { MarcheController } from './marche.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [MarcheController],
  providers: [MarcheService, PrismaService],
  exports: [MarcheService],
})
export class MarcheModule {}
