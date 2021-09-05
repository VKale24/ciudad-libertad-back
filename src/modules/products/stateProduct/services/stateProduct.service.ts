import { Injectable, NotFoundException } from '@nestjs/common';
import { StateProductRepository } from '../respositories/stateProduct.respository';
import { StateProductEntity } from '../stateProduct.entity';

@Injectable()
export class StateProductService {
  constructor(
    private readonly stateProductRepository: StateProductRepository,
  ) {}

  async getStateProducts() {
    const statesProducts = await this.stateProductRepository.find();

    return statesProducts;
  }

  async getStateProductById(idStateProduct: number) {
    const stateProduct = await this.stateProductRepository.findOne({
      idStateProduct,
    });

    if (!stateProduct) throw new NotFoundException();

    return stateProduct;
  }

  async createStateProduct(name: string) {
    const stateProduct = new StateProductEntity(name);

    await this.stateProductRepository.save(stateProduct);

    return stateProduct;
  }

  async updateStateProduct(idStateProduct: number, name: string) {
    const stateProduct = await this.getStateProductById(idStateProduct);

    if (name) stateProduct.name = name;

    await this.stateProductRepository.save(stateProduct);

    return stateProduct;
  }

  async deleteStateProduct(idStateProduct: number) {
    const stateProduct = await this.getStateProductById(idStateProduct);

    const result = await this.stateProductRepository.delete(stateProduct);

    return Promise.resolve({
        result: result,
        status: "success"
    });
  }
}
