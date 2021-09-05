import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators';
import { ProductDto } from 'src/modules/products/product/dto/product.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { SaleDto } from '../dto/sale.dto';
import { SaleService } from '../services/sale.service';

@Controller('sale')
@UseGuards(AuthGuard())
export class SaleController {
  constructor(private readonly saleService: SaleService) {}
  @Get()
  async getSales() {
    return await this.saleService.getSales();
  }
  @Get('/client/')
  async getSalesByClient(@GetUser() user: UserDto) {
    return await this.saleService.getSalesByClient(user);
  }
  @Get('/:id')
  async getSaleById(@Param('id') id: number) {
    return await this.saleService.getSaleById(id);
  }

  @Post()
  async createSale(
    @Body() saleDto: SaleDto,
    @Body('products')
    products: [
      {
        idProduct: number;
        quantity: number;
      },
    ],
    @GetUser() user: UserDto,
  ) {
    return await this.saleService.createSale(saleDto, user, products);
  }

  @Delete('/:id')
  async deleteSale(@Param('id') id: number) {
    return await this.saleService.deleteSale(id);
  }
}
