import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { AuthModule } from '../../auth/auth.module';
import { ProductSaleRepository } from '../product_sale/repositories/productSale.repository';
import { SaleController } from './controllers/sale.controller';
import { SaleRepository } from './repositories/sale.repository';
import { SaleService } from './services/sale.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleRepository,
      UserRepository,
      ProductSaleRepository,
      ProductRepository,
    ]),
    AuthModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
