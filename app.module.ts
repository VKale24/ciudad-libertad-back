import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './src/modules/auth/auth.module';
import { UserModule } from './src/modules/user/user.module';
import { SaleModule } from 'src/modules/sales/sale/sale.module';
import { CompanyModule } from 'src/modules/company/company.module';
import { typeOrmConfig } from './src/database/typeOrmConfig/typeorm.config';
import { ProductModule } from 'src/modules/products/product/product.module';
import { ProductSaleModule } from 'src/modules/sales/product_sale/productSale.module';
import { CategoryProductModule } from 'src/modules/products/categoryProducts/categoryProduct.module';
import { RoleModule } from 'src/modules/roles/role/role.module';
import { UserRoleModule } from 'src/modules/roles/user_role/userRole.module';
import { CartModule } from 'src/modules/carts/cart/cart.module';
import { CartProductModule } from 'src/modules/carts/cart_product/cartProduct.module';
import { FavoriteModule } from 'src/modules/favorites/favorite.module';
import { CommentModule } from 'src/modules/comments/comments.module';
import { StateProductModule } from 'src/modules/products/stateProduct/stateProduct.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserModule,
    ProductModule,
    SaleModule,
    ProductSaleModule,
    CategoryProductModule,
    CompanyModule,
    RoleModule,
    UserRoleModule,
    CartModule,
    CartProductModule,
    FavoriteModule,
    CommentModule,
    StateProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
