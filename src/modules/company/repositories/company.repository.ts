import { Repository, EntityRepository } from 'typeorm';
import { CompanyEntity } from '../company.entity';

@EntityRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {}
