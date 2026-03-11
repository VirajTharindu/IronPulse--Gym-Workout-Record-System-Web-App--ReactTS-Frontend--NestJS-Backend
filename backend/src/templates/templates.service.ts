import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';
import { TemplateExercise } from './template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { SharingService } from '../sharing/sharing.service';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepo: Repository<Template>,
    private sharingService: SharingService,
  ) {}

  private async ensureAccess(templateId: string, userId: string, edit = false) {
    const template = await this.templatesRepo.findOne({
      where: { id: templateId },
    });
    if (!template) throw new NotFoundException('Template not found');
    if (template.userId === userId) return template;
    const hasAccess = await this.sharingService.canAccess(
      'template',
      templateId,
      userId,
      edit,
    );
    if (!hasAccess) throw new ForbiddenException('Access denied');
    return template;
  }

  async findAll(userId: string): Promise<Template[]> {
    const own = await this.templatesRepo.find({
      where: { userId },
      order: { name: 'ASC' },
    });
    const sharedIds = await this.sharingService.getSharedTemplateIds(userId);
    if (sharedIds.length === 0) return own;
    const { In } = await import('typeorm');
    const shared = await this.templatesRepo.find({
      where: { id: In(sharedIds) },
      order: { name: 'ASC' },
    });
    const combined = [...own];
    for (const t of shared) {
      if (!combined.find((x) => x.id === t.id)) combined.push(t);
    }
    combined.sort((a, b) => a.name.localeCompare(b.name));
    return combined;
  }

  async findOne(id: string, userId: string): Promise<Template> {
    return this.ensureAccess(id, userId);
  }

  async create(dto: CreateTemplateDto, userId: string): Promise<Template> {
    const exercises: TemplateExercise[] = dto.exercises.map((e) => ({
      exerciseId: e.exerciseId,
      name: e.name,
      muscleGroup: e.muscleGroup,
      targetSets: e.targetSets ?? 3,
      targetReps: e.targetReps,
      targetWeightKg: e.targetWeightKg,
    }));
    const template = this.templatesRepo.create({
      userId,
      name: dto.name,
      exercisesJson: JSON.stringify(exercises),
    });
    return this.templatesRepo.save(template);
  }

  async update(
    id: string,
    dto: UpdateTemplateDto,
    userId: string,
  ): Promise<Template> {
    const template = await this.ensureAccess(id, userId, true);
    if (dto.name !== undefined) template.name = dto.name;
    if (dto.exercises !== undefined) {
      const exercises: TemplateExercise[] = dto.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        name: e.name,
        muscleGroup: e.muscleGroup,
        targetSets: e.targetSets ?? 3,
        targetReps: e.targetReps,
        targetWeightKg: e.targetWeightKg,
      }));
      template.exercisesJson = JSON.stringify(exercises);
    }
    return this.templatesRepo.save(template);
  }

  async remove(id: string, userId: string): Promise<void> {
    const template = await this.ensureAccess(id, userId, true);
    await this.templatesRepo.remove(template);
  }
}
