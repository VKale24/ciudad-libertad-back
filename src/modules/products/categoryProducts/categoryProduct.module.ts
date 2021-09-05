import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductController } from './controllers/categoryProduct.controller';
import { CategoryProductRepository } from './repositories/categoryProduct.repository';
import { CategoryProductService } from './services/categoryProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryProductRepository])],
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
  exports: [CategoryProductService],
})
export class CategoryProductModule {}
