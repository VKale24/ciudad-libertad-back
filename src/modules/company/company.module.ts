import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers/company.controller';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyService } from './services/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRepository])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
