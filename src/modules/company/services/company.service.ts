import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyEntity } from '../company.entity';
import { CompanyRepository } from '../repositories/company.repository';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async getCompanys() {
    const companys = await this.companyRepository.find();

    return companys;
  }

  async getCompanyById(idCompany: number) {
    const company = await this.companyRepository.findOne(idCompany);

    if (!company) throw new NotFoundException();

    return company;
  }

  async createCompany(name: string) {
    var company;
    try {
      company = new CompanyEntity(name);
      const result = await this.companyRepository.save(company);
      return result;
    } catch (error) {
      if (error.code === '23505') {
        // duplicate name company
        throw new ConflictException('Name of the company already exists');
      }
    }
  }

  async updateCompany(id: number, name: string) {
    const company = await this.getCompanyById(id);

    company.name = name;

    await this.companyRepository.save(company);
    return company;
  }

  async deleteCompany(id: number) {
    const company = await this.getCompanyById(id);

    const result = await this.companyRepository.delete(company);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
