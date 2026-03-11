import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './workout.entity';
import { WorkoutSet } from './workout-set.entity';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { SharingModule } from '../sharing/sharing.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, WorkoutSet]),
    SharingModule,
    forwardRef(() => WebsocketModule),
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
