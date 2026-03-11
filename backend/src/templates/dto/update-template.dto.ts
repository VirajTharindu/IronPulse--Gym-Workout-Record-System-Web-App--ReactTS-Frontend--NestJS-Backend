import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateExerciseDto } from './create-template.dto';

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateExerciseDto)
  @IsOptional()
  exercises?: TemplateExerciseDto[];
}
