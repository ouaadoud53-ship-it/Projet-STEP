import { Module } from '@nestjs/common';
import { DecompositionService } from './decomposition.service';
import { DecompositionController } from './decomposition.controller';
import { LibelleProductionModule } from '../production/production.module';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [LibelleProductionModule],
  controllers: [DecompositionController],
  providers: [DecompositionService, PrismaService],
})
export class DecompositionModule {}
