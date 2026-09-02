import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';
import { MarcheModule } from './marche/marche.module';
import { SerieModule } from './serie/serie.module';
import { OuvrageModule } from './ouvrage/ouvrage.module';
import { LibelleProductionModule as ProductionModule } from './production/production.module';
import { DecompositionModule } from './decomposition/decomposition.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    MarcheModule,
    SerieModule,
    OuvrageModule,
    ProductionModule,
    DecompositionModule,
    DashboardModule,
  ],
})
export class AppModule {}
