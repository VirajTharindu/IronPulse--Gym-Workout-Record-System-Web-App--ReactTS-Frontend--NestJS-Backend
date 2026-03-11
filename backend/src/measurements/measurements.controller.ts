import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('measurements')
export class MeasurementsController {
  constructor(private measurementsService: MeasurementsService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.measurementsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.measurementsService.findOne(id, user.id);
  }

  @Post()
  create(@Body() dto: CreateMeasurementDto, @CurrentUser() user: User) {
    return this.measurementsService.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMeasurementDto,
    @CurrentUser() user: User,
  ) {
    return this.measurementsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.measurementsService.remove(id, user.id);
  }
}
