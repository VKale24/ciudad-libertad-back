import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SocialMediaDto } from './dto/social_media.dto';
import { SocialMediaService } from './social_media.service';

@Controller('social_media')
export class SocialMediaController {
  constructor(private readonly _socialMediaService: SocialMediaService) {}

  @Get()
  async getAllSocialMedia() {
    return await this._socialMediaService.getAllSocialMedia();
  }

  @Get('/team/:idTeam')
  async getSocialMediaByTeam(@Param('idTeam') idTeam: number) {
    return await this._socialMediaService.getSocialMediaByTeam(idTeam);
  }

  @Post()
  async createSocialMediaToTeam(
    @Body() socialMedia: SocialMediaDto,
    @Body('idTeam') idTeam: number,
  ) {
    return await this._socialMediaService.createSocialMediaToTeam(
      socialMedia,
      idTeam,
    );
  }

  @Patch('/:idSocialMedia')
  async updateTeam(
    @Param('idSocialMedia') idSocialMedia: number,
    @Body() socialMedia: SocialMediaDto,
  ) {
    return await this._socialMediaService.updateSocialMedia(
        idSocialMedia,
      socialMedia,
    );
  }

  @Delete("/:idSocialMedia")
  async deleteTeam(
      @Param("idSocialMedia")idSocialMedia: number
  ){
    return await this._socialMediaService.deleteSocialMedia(idSocialMedia);
  }
}
