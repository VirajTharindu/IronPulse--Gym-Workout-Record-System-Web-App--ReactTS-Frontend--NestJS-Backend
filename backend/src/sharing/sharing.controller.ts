import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SharingService } from './sharing.service';
import { ShareDto } from './dto/share.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('shares')
export class SharingController {
  constructor(private sharingService: SharingService) {}

  @Post()
  share(@Body() dto: ShareDto, @CurrentUser() user: User) {
    return this.sharingService.share(
      dto.resourceType,
      dto.resourceId,
      user.id,
      dto.sharedWithId,
      dto.permission,
    );
  }

  @Get()
  getSharedWithMe(@CurrentUser() user: User) {
    return this.sharingService.getSharedWithMe(user.id);
  }

  @Delete(':id')
  revokeShare(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sharingService.revokeShare(id, user.id);
  }
}
