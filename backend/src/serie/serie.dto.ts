import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSerieDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  serie: string;

  @IsString()
  @IsNotEmpty()
  unite: string;

  @IsNumber()
  @IsNotEmpty()
  quantite: number;

  @IsNumber()
  @IsNotEmpty()
  puMarcheHT: number;

  @IsString()
  @IsNotEmpty()
  marcheId: string;
}

export class UpdateSerieDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  serie?: string;

  @IsString()
  @IsOptional()
  unite?: string;

  @IsNumber()
  @IsOptional()
  quantite?: number;

  @IsNumber()
  @IsOptional()
  puMarcheHT?: number;

  @IsString()
  @IsOptional()
  marcheId?: string;
}
