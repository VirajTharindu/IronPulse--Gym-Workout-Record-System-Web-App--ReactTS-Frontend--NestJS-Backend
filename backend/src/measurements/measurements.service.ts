import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './measurement.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private measurementsRepo: Repository<Measurement>,
  ) {}

  async findAll(userId: string): Promise<Measurement[]> {
    return this.measurementsRepo.find({
      where: { userId },
      order: { recordedAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Measurement> {
    const m = await this.measurementsRepo.findOne({
      where: { id, userId },
    });
    if (!m) throw new NotFoundException('Measurement not found');
    return m;
  }

  async create(dto: CreateMeasurementDto, userId: string): Promise<Measurement> {
    const m = this.measurementsRepo.create({
      userId,
      type: dto.type,
      value: dto.value,
      unit: dto.unit || '',
      recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
    });
    return this.measurementsRepo.save(m);
  }

  async update(
    id: string,
    dto: UpdateMeasurementDto,
    userId: string,
  ): Promise<Measurement> {
    const m = await this.findOne(id, userId);
    if (dto.type !== undefined) m.type = dto.type;
    if (dto.value !== undefined) m.value = dto.value;
    if (dto.unit !== undefined) m.unit = dto.unit;
    if (dto.recordedAt !== undefined) m.recordedAt = new Date(dto.recordedAt);
    return this.measurementsRepo.save(m);
  }

  async remove(id: string, userId: string): Promise<void> {
    const m = await this.findOne(id, userId);
    await this.measurementsRepo.remove(m);
  }
}
