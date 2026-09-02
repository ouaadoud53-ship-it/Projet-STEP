import { IsString, IsInt, IsEnum, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export enum EtatMarche {
  PREPARATION = 'PREPARATION',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  CLOTURE = 'CLOTURE'
}

export class CreateMarcheDto {
  @IsString()
  @IsNotEmpty()
  codeAffaire: string;

  @IsString()
  @IsNotEmpty()
  numeroMarche: string;

  @IsString()
  @IsNotEmpty()
  maitreOuvrage: string;

  @IsString()
  @IsNotEmpty()
  partenaire: string;

  @IsDateString()
  @IsNotEmpty()
  dateOSCommencement: string;

  @IsInt()
  @IsNotEmpty()
  delaiProjetMois: number;

  @IsEnum(EtatMarche)
  @IsOptional()
  etat?: EtatMarche;
}

export class UpdateMarcheDto {
  @IsString()
  @IsOptional()
  codeAffaire?: string;

  @IsString()
  @IsOptional()
  numeroMarche?: string;

  @IsString()
  @IsOptional()
  maitreOuvrage?: string;

  @IsString()
  @IsOptional()
  partenaire?: string;

  @IsDateString()
  @IsOptional()
  dateOSCommencement?: string;

  @IsInt()
  @IsOptional()
  delaiProjetMois?: number;

  @IsEnum(EtatMarche)
  @IsOptional()
  etat?: EtatMarche;
}
