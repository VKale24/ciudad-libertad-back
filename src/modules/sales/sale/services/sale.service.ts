import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { ProductSaleEntity } from '../../product_sale/productSale.entity';
import { ProductSaleRepository } from '../../product_sale/repositories/productSale.repository';
import { SaleDto } from '../dto/sale.dto';
import { SaleRepository } from '../repositories/sale.repository';
import { SaleEntity } from '../sale.entity';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly userRepository: UserRepository,
    private readonly productSaleRepository: ProductSaleRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async getSales() {
    const sales = await this.saleRepository.find({ relations: ['user'] });

    return sales;
  }

  async getSalesByClient(userDto: UserDto) {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });
    if (!user) throw new NotFoundException();

    const sales = await this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .where('sale.user.idUser = :idUser', { idUser: user.idUser })
      .getMany();

    return sales;
  }

  async getSaleById(idSale: number) {
    const sale = await this.saleRepository.findOne({ idSale });

    if (!sale) throw new NotFoundException();

    return sale;
  }

  async createSale(
    saleDto: SaleDto,
    userDto: UserDto,
    products: [
      {
        idProduct: number;
        quantity: number;
      },
    ],
  ) {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) throw new NotFoundException();

    const sale = new SaleEntity(saleDto.adress, saleDto.payment);

    sale.user = user;
    const saleCreate = await this.saleRepository.save(sale);

    products.map(async (products) => {
      const objProd = JSON.parse(JSON.stringify(products));
      const product = await this.productRepository.findOne(objProd.idProduct, {
        relations: ['categoryProduct', 'company'],
      });
      const productSale = new ProductSaleEntity(
        objProd.quantity,
        product,
        saleCreate,
      );

      await this.productSaleRepository.save(productSale);
    });

    return sale;
  }

  async deleteSale(idSale: number) {
    const sale = await this.getSaleById(idSale);

    const result = await this.saleRepository.delete(sale);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
