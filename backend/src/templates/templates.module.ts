import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { SharingModule } from '../sharing/sharing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    SharingModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
