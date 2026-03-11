import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateWorkoutDto {
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
