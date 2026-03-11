import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateWorkoutSetDto {
  @IsUUID()
  exerciseId: string;

  @IsNumber()
  @Min(0)
  setOrder: number;

  @IsNumber()
  @Min(0)
  reps: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weightKg?: number;
}
