import { Module } from '@nestjs/common';
import { LibelleProductionService } from './production.service';
import { LibelleProductionController } from './production.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [LibelleProductionController],
  providers: [LibelleProductionService, PrismaService],
  exports: [LibelleProductionService],
})
export class LibelleProductionModule {}
