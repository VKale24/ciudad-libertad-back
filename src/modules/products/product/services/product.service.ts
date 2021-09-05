import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
import { CategoryProductRepository } from '../../categoryProducts/repositories/categoryProduct.repository';
import { StateProductRepository } from '../../stateProduct/respositories/stateProduct.respository';
import { ProductDto } from '../dto/product.dto';
import { ProductEntity } from '../product.entity';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryProductRepository: CategoryProductRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly stateProductRepository: StateProductRepository,
  ) {}

  async getProducts() {
    const products = await this.productRepository.find({
      relations: ['categoryProduct', 'company', 'stateProduct'],
    });

    return products;
  }

  async getProductById(idProduct: number) {
    const product = await this.productRepository.findOne(idProduct, {
      relations: ['categoryProduct', 'company', 'stateProduct'],
    });

    if (!product) throw new NotFoundException();

    return product;
  }

  async createProduct(
    productDto: ProductDto,
    idCategoryProduct: number,
    idCompany: number,
    idStateProduct: number,
  ) {
    const categoryProduct = await this.categoryProductRepository.findOne({
      where: { idCategoryProduct: idCategoryProduct },
    });
    if (!categoryProduct) throw new NotFoundException();

    const company = await this.companyRepository.findOne({
      where: { idCompany: idCompany },
    });
    if (!company) throw new NotFoundException();

    const stateProduct = await this.stateProductRepository.findOne({
      where: { idStateProduct: idStateProduct },
    });

    if (!stateProduct) throw new NotFoundException();

    try {
      const product = new ProductEntity(
        productDto.name,
        productDto.price,
        productDto.images,
        productDto.offert,
        productDto.description,
        productDto.quantity,
        productDto.calification,
      );

      product.company = company;
      product.categoryProduct = categoryProduct;
      product.stateProduct = stateProduct;

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Product name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateProduct(
    idProduct: number,
    productDto: ProductDto,
    idCompany: number,
    idCategoryProduct: number,
    idStateProduct: number,
  ) {
    const product = await this.getProductById(idProduct);
    if (productDto.name) product.name = productDto.name;
    if (productDto.calification) product.calification = productDto.calification;
    if (productDto.description) product.description = productDto.description;
    if (productDto.images) product.images = productDto.images;
    if (productDto.offert) product.offert = productDto.offert;
    if (productDto.price) product.price = productDto.price;
    if (productDto.quantity) product.quantity = productDto.quantity;
    if (productDto) product.quantity = productDto.quantity;
    if (productDto.quantity) product.quantity = productDto.quantity;

    if (idCompany) {
      const company = await this.companyRepository.findOne(idCompany);
      if (!company) throw new NotFoundException();
      product.company = company;
    }

    if (idCategoryProduct) {
      const categoryProduct = await this.categoryProductRepository.findOne(
        idCategoryProduct,
      );
      if (!categoryProduct) throw new NotFoundException();
      product.categoryProduct = categoryProduct;
    }
    if (idStateProduct) {
      const stateProduct = await this.stateProductRepository.findOne(
        idStateProduct,
      );
      if (!stateProduct) throw new NotFoundException();
      product.stateProduct = stateProduct;
    }
    const productUpdate = await this.productRepository.save(product);

    return productUpdate;
  }

  async deleteProduct(idProduct: number) {
    const product = await this.getProductById(idProduct);

    const result = await this.productRepository.delete(product);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
