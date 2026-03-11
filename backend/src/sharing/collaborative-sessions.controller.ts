import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('collaborative-sessions')
export class CollaborativeSessionsController {
  constructor(private sharingService: SharingService) {}

  @Post()
  create(@Body() body: { workoutId: string }, @CurrentUser() user: User) {
    return this.sharingService.createCollaborativeSession(body.workoutId, user.id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sharingService.joinCollaborativeSession(id, user.id);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sharingService.leaveCollaborativeSession(id, user.id);
  }

  @Get(':id')
  getSession(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sharingService.getSession(id, user.id);
  }
}
