import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductDto } from '../dto/product.dto';
import { ProductService } from '../services/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getProducts() {
    return await this.productService.getProducts();
  }
  @Get('/:id')
  async getProductsById(@Param('id') id: number) {
    return await this.productService.getProductById(id);
  }

  @Post()
  async createProduct(
    @Body() productDto: ProductDto,
    @Body('idCategoryProduct') idCategoryProduct: number,
    @Body('idStateProduct') idStateProduct: number,
    @Body('idCompany') idCompany: number,
  ) {
    return await this.productService.createProduct(
      productDto,
      idCategoryProduct,
      idCompany,
      idStateProduct
    );
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productDto: ProductDto,
    @Body('idCompany') idCompany: number,
    @Body('idCategoryProduct') idCategoryProduct: number,
    @Body('idStateProduct') idStateProduct: number,
  ) {
    return await this.productService.updateProduct(
      id,
      productDto,
      idCompany,
      idCategoryProduct,
      idStateProduct
    );
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.deleteProduct(id);
  }
}
