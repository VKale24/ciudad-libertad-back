import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProductRepository } from '../products/product/repositories/product.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { FavoriteController } from './controllers/favorite.controller';
import { FavoriteRepository } from './repositories/favorite.repository';
import { FavoriteService } from './services/favorite.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteRepository, UserRepository, ProductRepository]), AuthModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
