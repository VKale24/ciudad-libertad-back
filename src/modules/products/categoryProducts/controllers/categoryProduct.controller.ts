import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryProductService } from '../services/categoryProduct.service';

@Controller('categoryProduct')
export class CategoryProductController {
  constructor(
    private readonly categoryProductService: CategoryProductService,
  ) {}

  @Get()
  async getCategoryProduct() {
    return await this.categoryProductService.getCategoryProduct();
  }

  @Get("/:id")
  async getCategoryProductById(
      @Param("id")id: number
  ) {
    return await this.categoryProductService.getCategoryProductById(id);
  }

  @Post()
  async createCategoryProduct(@Body('name') name: string) {
    return await this.categoryProductService.createCategoryProducts(name);
  }

  @Patch('/:id')
  async updateCategoryProduct(@Param('id') id: number, @Body('name') name: string) {
    return await this.categoryProductService.updateCategoryProduct(id,name);
  }

  @Delete('/:id')
  async deleteCategoryProduct(@Param('id') id: number) {
    return this.categoryProductService.deleteCategoryProduct(id);
  }
}
