import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
import { AuthModule } from '../../auth/auth.module';
import { CategoryProductRepository } from '../categoryProducts/repositories/categoryProduct.repository';
import { StateProductRepository } from '../stateProduct/respositories/stateProduct.respository';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository, CategoryProductRepository, CompanyRepository, StateProductRepository]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
