import { Injectable } from '@nestjs/common';
import { ProductSaleRepository } from '../repositories/productSale.repository';

@Injectable()
export class ProductSaleService {
  constructor(private readonly productSaleRepository: ProductSaleRepository) {}

  async getProductSale() {
    const productSale = await this.productSaleRepository.find({relations: ["product", "sale"]});
    return productSale;
  }
  async getProductBySale(idSale: number) {
    const productSale = await this.productSaleRepository
      .createQueryBuilder('productSale')
      .leftJoinAndSelect('productSale.sale', 'sale')
      .leftJoinAndSelect('productSale.product', 'product')
      .where('sale.idSale = :idSale', { idSale: idSale })
      .getMany();

    return productSale;
  }
}
