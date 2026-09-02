import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOuvrageDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  numeroPrixBordereau: string;

  @IsString()
  @IsNotEmpty()
  ouvrage: string;

  @IsString()
  @IsNotEmpty()
  unite: string;

  @IsNumber()
  @IsNotEmpty()
  quantite: number;

  @IsNumber()
  @IsNotEmpty()
  puMarcheHT: number;

  @IsNumber()
  @IsNotEmpty()
  puRevientReference: number;

  @IsString()
  @IsNotEmpty()
  serieId: string;
}

export class UpdateOuvrageDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  numeroPrixBordereau?: string;

  @IsString()
  @IsOptional()
  ouvrage?: string;

  @IsString()
  @IsOptional()
  unite?: string;

  @IsNumber()
  @IsOptional()
  quantite?: number;

  @IsNumber()
  @IsOptional()
  puMarcheHT?: number;

  @IsNumber()
  @IsOptional()
  puRevientReference?: number;

  @IsString()
  @IsOptional()
  serieId?: string;
}
