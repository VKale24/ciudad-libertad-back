import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateProductController } from './controllers/stateProduct.controller';
import { StateProductRepository } from './respositories/stateProduct.respository';
import { StateProductService } from './services/stateProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([StateProductRepository])],
  controllers: [StateProductController],
  providers: [StateProductService],
  exports: [StateProductService],
})
export class StateProductModule {}
