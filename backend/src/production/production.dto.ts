import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

const repartitionValues = ['GC', 'ETU', 'ELE', 'EQ', 'MES', 'EXP', 'EC', 'PM'];

export class CreateLibelleProductionDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  numeroPrixUnitaire: string;

  @IsString()
  @IsNotEmpty()
  cleRepartition: string;

  @IsString()
  @IsNotEmpty()
  libelleProduction: string;

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
  ouvrageId: string;
}

export class UpdateLibelleProductionDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  numeroPrixUnitaire?: string;

  @IsString()
  @IsOptional()
  cleRepartition?: string;

  @IsString()
  @IsOptional()
  libelleProduction?: string;

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
  ouvrageId?: string;
}

import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';

export class CreateBulkLibelleProductionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLibelleProductionDto)
  items: CreateLibelleProductionDto[];
}
