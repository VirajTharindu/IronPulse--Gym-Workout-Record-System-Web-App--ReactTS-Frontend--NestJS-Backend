import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateWorkoutDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;
}
