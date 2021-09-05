import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Get()
  async getCompanys() {
    return await this.companyService.getCompanys();
  }

  @Get('/:id')
  async getCompanyById(@Param('id', ParseIntPipe) id: number) {
    return await this.companyService.getCompanyById(id);
  }

  @Post()
  async createCompany(@Body('name') name: string) {
    return await this.companyService.createCompany(name);
  }

  @Patch('/:id')
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return await this.companyService.updateCompany(id, name);
  }

  @Delete('/:id')
  async deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return await this.companyService.deleteCompany(id);
  }
}
