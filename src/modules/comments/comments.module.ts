import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProductRepository } from '../products/product/repositories/product.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { CommentController } from './controllers/comment.controller';
import { CommentRepository } from './repositories/comment.repository';
import { CommentService } from './services/comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ProductRepository, CommentRepository]),
    AuthModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
