import { Module } from '@nestjs/common';
import { OuvrageService } from './ouvrage.service';
import { OuvrageController } from './ouvrage.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [OuvrageController],
  providers: [OuvrageService, PrismaService],
  exports: [OuvrageService],
})
export class OuvrageModule {}
