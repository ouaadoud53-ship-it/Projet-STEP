import { Module } from '@nestjs/common';
import { SerieService } from './serie.service';
import { SerieController } from './serie.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [SerieController],
  providers: [SerieService, PrismaService],
  exports: [SerieService],
})
export class SerieModule {}
