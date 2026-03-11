import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WorkoutGateway } from './workout.gateway';
import { WorkoutsModule } from '../workouts/workouts.module';
import { SharingModule } from '../sharing/sharing.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
    forwardRef(() => WorkoutsModule),
    SharingModule,
  ],
  providers: [WorkoutGateway],
  exports: [WorkoutGateway],
})
export class WebsocketModule {}
