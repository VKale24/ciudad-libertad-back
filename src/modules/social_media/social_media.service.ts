import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamRepository } from '../team/team/team.repository';
import { SocialMediaDto } from './dto/social_media.dto';
import { SocialMediaEntity } from './social_media.entity';
import { SocialMediaRepository } from './social_media.repository';

@Injectable()
export class SocialMediaService {
  @InjectRepository(SocialMediaRepository)
  private readonly _socialMediaRepository: SocialMediaRepository;

  @InjectRepository(TeamRepository)
  private readonly _teamRepository: TeamRepository;

  async getAllSocialMedia() {
    const socialMedias = await this._socialMediaRepository.find();

    return socialMedias;
  }

  async getSocialMediaByTeam(idTeam: number) {
    const socialMedia = await this._socialMediaRepository
      .createQueryBuilder('social_media')
      .leftJoinAndSelect('social_media.team', 'team')
      .where('social_media.team.idTeam = :idTeam', { idTeam: idTeam })
      .getMany();

    return socialMedia;
  }

  async createSocialMediaToTeam(
    socialMediaDto: SocialMediaDto,
    idTeam: number,
  ) {
    const { name, link } = socialMediaDto;

    if (idTeam) {
      const team = await this._teamRepository.findOne(idTeam);
      if (team) {
        const socialMedia = new SocialMediaEntity();
        socialMedia.name = name;
        socialMedia.link = link;
        socialMedia.team = team;
        const socialM = await this._socialMediaRepository.save(socialMedia);
        return socialM;
      }
    } else throw new NotFoundException();
  }

  async updateSocialMedia(
    idSocialMedia: number,
    socialMediaDto: SocialMediaDto,
  ) {
    const { name, link } = socialMediaDto;

    const socialMedia = await this._socialMediaRepository.findOne(
      idSocialMedia,
    );
    if (socialMedia) {
      socialMedia.name = name;
      socialMedia.link = link;
    }

    const socialM = await this._socialMediaRepository.save(socialMedia);
    return socialM;
  }

  async deleteSocialMedia(idSocialMedia: number) {
    const socialMedia = await this._socialMediaRepository.findOne(
      idSocialMedia,
    );

    if (socialMedia) {
      const result = await this._socialMediaRepository.delete(idSocialMedia);
      return Promise.resolve({
        result: result,
        status: 'success',
      });
    }
  }
}
