import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartProductService } from './services/cartProduct.service';
import { CartRepository } from '../cart/repositories/cart.repository';
import { CartProductRepository } from './repositories/cart.repository';
import { CartProductController } from './controllers/cartProduct.controller';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      CartRepository,
      ProductRepository,
      CartProductRepository,
    ]),AuthModule
  ],
  controllers: [CartProductController],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
