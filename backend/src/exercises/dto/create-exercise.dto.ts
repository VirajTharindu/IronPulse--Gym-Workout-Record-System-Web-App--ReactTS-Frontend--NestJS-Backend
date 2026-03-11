import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsString()
  muscleGroup: string;

  @IsString()
  @IsOptional()
  equipment?: string;

  @IsBoolean()
  @IsOptional()
  isCustom?: boolean;
}
