import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { AuthModule } from '../../auth/auth.module';
import { UserRepository } from '../../user/repositories/user.repository';
import { CartProductRepository } from '../cart_product/repositories/cart.repository';
import { CartProductService } from '../cart_product/services/cartProduct.service';
import { CartController } from './controllers/cart.controller';
import { CartRepository } from './repositories/cart.repository';
import { CartService } from './services/cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartRepository, UserRepository, ProductRepository, CartProductRepository]),
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartProductService],
  exports: [CartService],
})
export class CartModule {}
