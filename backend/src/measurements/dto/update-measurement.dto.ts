import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class UpdateMeasurementDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsDateString()
  @IsOptional()
  recordedAt?: string;
}
