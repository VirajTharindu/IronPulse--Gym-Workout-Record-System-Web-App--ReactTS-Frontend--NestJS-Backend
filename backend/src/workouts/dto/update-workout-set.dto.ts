import { IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class UpdateWorkoutSetDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  setOrder?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reps?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weightKg?: number;

  @IsDateString()
  @IsOptional()
  completedAt?: string;
}
