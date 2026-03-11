import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsDateString()
  @IsOptional()
  recordedAt?: string;
}
