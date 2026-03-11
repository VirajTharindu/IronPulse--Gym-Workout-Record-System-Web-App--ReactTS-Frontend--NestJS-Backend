import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutGateway } from '../websocket/workout.gateway';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { UpdateWorkoutSetDto } from './dto/update-workout-set.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('workouts')
export class WorkoutsController {
  constructor(
    private workoutsService: WorkoutsService,
    private workoutGateway: WorkoutGateway,
  ) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.workoutsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.workoutsService.findOne(id, user.id);
  }

  @Post()
  async create(@Body() dto: CreateWorkoutDto, @CurrentUser() user: User) {
    const workout = await this.workoutsService.create(dto, user.id);
    this.workoutGateway.broadcastWorkoutCreated(workout.id, workout);
    return workout;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutDto,
    @CurrentUser() user: User,
  ) {
    const workout = await this.workoutsService.update(id, dto, user.id);
    this.workoutGateway.broadcastWorkoutUpdated(id, workout);
    return workout;
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.workoutsService.remove(id, user.id);
  }

  @Get(':id/sets')
  getSets(@Param('id') id: string, @CurrentUser() user: User) {
    return this.workoutsService.getSets(id, user.id);
  }

  @Post(':id/sets')
  async addSet(
    @Param('id') id: string,
    @Body() dto: CreateWorkoutSetDto,
    @CurrentUser() user: User,
  ) {
    const set = await this.workoutsService.addSet(id, dto, user.id);
    this.workoutGateway.broadcastSetAdded(id, set);
    return set;
  }

  @Patch(':id/sets/:setId')
  async updateSet(
    @Param('id') id: string,
    @Param('setId') setId: string,
    @Body() dto: UpdateWorkoutSetDto,
    @CurrentUser() user: User,
  ) {
    const set = await this.workoutsService.updateSet(id, setId, dto, user.id);
    this.workoutGateway.broadcastSetUpdated(id, set);
    if (dto.completedAt) {
      this.workoutGateway.broadcastSetCompleted(id, null, set);
    }
    return set;
  }

  @Delete(':id/sets/:setId')
  removeSet(
    @Param('id') id: string,
    @Param('setId') setId: string,
    @CurrentUser() user: User,
  ) {
    return this.workoutsService.removeSet(id, setId, user.id);
  }
}
