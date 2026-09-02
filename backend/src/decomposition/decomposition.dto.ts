import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDecompositionDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  unite: string;

  @IsString()
  @IsNotEmpty()
  libelleElement: string;

  @IsString()
  @IsNotEmpty()
  uniteControle: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsNumber()
  @IsNotEmpty()
  quantite: number;

  @IsNumber()
  @IsNotEmpty()
  prixUnitaire: number;

  @IsString()
  @IsNotEmpty()
  libelleProductionId: string;
}

export class UpdateDecompositionDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  unite?: string;

  @IsString()
  @IsOptional()
  libelleElement?: string;

  @IsString()
  @IsOptional()
  uniteControle?: string;

  @IsString()
  @IsOptional()
  section?: string;

  @IsNumber()
  @IsOptional()
  quantite?: number;

  @IsNumber()
  @IsOptional()
  prixUnitaire?: number;

  @IsString()
  @IsOptional()
  libelleProductionId?: string;
}
