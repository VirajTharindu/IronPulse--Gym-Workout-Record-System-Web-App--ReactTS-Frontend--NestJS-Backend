import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TemplateExerciseDto {
  @IsString()
  exerciseId: string;

  @IsString()
  name: string;

  @IsString()
  muscleGroup: string;

  @IsOptional()
  targetSets?: number;

  @IsOptional()
  targetReps?: number;

  @IsOptional()
  targetWeightKg?: number;
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateExerciseDto)
  exercises: TemplateExerciseDto[];
}
