import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('volume')
  getVolume(
    @CurrentUser() user: User,
    @Query('exerciseId') exerciseId?: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getVolumeOverTime(
      user.id,
      exerciseId,
      days ? parseInt(days, 10) : 30,
    );
  }

  @Get('personal-records')
  getPersonalRecords(@CurrentUser() user: User) {
    return this.analyticsService.getPersonalRecords(user.id);
  }
}
