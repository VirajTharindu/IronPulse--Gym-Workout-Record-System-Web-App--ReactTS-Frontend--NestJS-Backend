import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  muscleGroup?: string;

  @IsString()
  @IsOptional()
  equipment?: string;

  @IsBoolean()
  @IsOptional()
  isCustom?: boolean;
}
