import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepo: Repository<Exercise>,
  ) {}

  async findAll(userId: string): Promise<Exercise[]> {
    return this.exercisesRepo.find({
      where: [{ isCustom: false }, { userId, isCustom: true }],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Exercise> {
    const ex = await this.exercisesRepo.findOne({ where: { id } });
    if (!ex) throw new NotFoundException('Exercise not found');
    if (ex.isCustom && ex.userId !== userId) {
      throw new ForbiddenException('Cannot access this exercise');
    }
    return ex;
  }

  async create(dto: CreateExerciseDto, userId: string): Promise<Exercise> {
    const ex = this.exercisesRepo.create({
      ...dto,
      userId,
      isCustom: dto.isCustom ?? true,
    });
    return this.exercisesRepo.save(ex);
  }

  async update(
    id: string,
    dto: UpdateExerciseDto,
    userId: string,
  ): Promise<Exercise> {
    const ex = await this.findOne(id, userId);
    if (ex.isCustom && ex.userId !== userId) {
      throw new ForbiddenException('Cannot update this exercise');
    }
    Object.assign(ex, dto);
    return this.exercisesRepo.save(ex);
  }

  async remove(id: string, userId: string): Promise<void> {
    const ex = await this.findOne(id, userId);
    if (ex.isCustom && ex.userId !== userId) {
      throw new ForbiddenException('Cannot delete this exercise');
    }
    await this.exercisesRepo.remove(ex);
  }
}
