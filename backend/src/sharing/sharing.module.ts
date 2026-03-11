import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Share } from './share.entity';
import { CollaborativeSession } from './collaborative-session.entity';
import { SharingController } from './sharing.controller';
import { CollaborativeSessionsController } from './collaborative-sessions.controller';
import { SharingService } from './sharing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Share, CollaborativeSession])],
  controllers: [SharingController, CollaborativeSessionsController],
  providers: [SharingService],
  exports: [SharingService],
})
export class SharingModule {}
