import { Repository, EntityRepository } from 'typeorm';
import { SocialMediaEntity } from './social_media.entity';


@EntityRepository(SocialMediaEntity)
export class SocialMediaRepository extends Repository<SocialMediaEntity> {}
