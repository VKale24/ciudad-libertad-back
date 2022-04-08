import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TeamRepository } from '../team/team/team.repository';
import { SocialMediaRepository } from './social_media.repository';
import { SocialMediaController } from './social_media.controller';
import { SocialMediaService } from './social_media.service';


@Module({
  imports: [TypeOrmModule.forFeature([SocialMediaRepository, TeamRepository])],
  controllers: [SocialMediaController],
  providers: [SocialMediaService],
  exports: [SocialMediaService],
})
export class SocialMediaModule {}
