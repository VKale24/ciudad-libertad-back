import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { runInThisContext } from 'vm';
import { CategoryProductEntity } from '../categoryProduct.entity';
import { CategoryProductRepository } from '../repositories/categoryProduct.repository';

@Injectable()
export class CategoryProductService {
  constructor(
    private readonly categoryProductRepository: CategoryProductRepository,
  ) {}

  async getCategoryProduct() {
    const categoryProducts = await this.categoryProductRepository.find();

    return categoryProducts;
  }

  async getCategoryProductById(idCategoryProduct: number) {
    const category = await this.categoryProductRepository.findOne({
      idCategoryProduct,
    });

    if (!category) throw new NotFoundException();

    return category;
  }

  async createCategoryProducts(name: string) {
    const categoryProduct = new CategoryProductEntity(name);

    try {
      const category = await this.categoryProductRepository.save(
        categoryProduct,
      );
    } catch (error) {
      throw new ConflictException();
    }

    return categoryProduct;
  }

  async updateCategoryProduct(id: number, name: string) {
    const category = await this.getCategoryProductById(id);

    category.name = name;
    await this.categoryProductRepository.save(category);

    return category;
  }

  async deleteCategoryProduct(id: number) {
    const category = await this.getCategoryProductById(id);

    const result = await this.categoryProductRepository.delete(category);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
