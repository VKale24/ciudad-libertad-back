import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { ProductSaleController } from './controllers/productSale.controller';
import { ProductSaleRepository } from './repositories/productSale.repository';
import { ProductSaleService } from './services/productSale.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSaleRepository]), AuthModule],
  controllers: [ProductSaleController],
  providers: [ProductSaleService],
  exports: [ProductSaleService],
})
export class ProductSaleModule {}
