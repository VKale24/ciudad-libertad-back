import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { CartProductService } from '../services/cartProduct.service';

@Controller('cartProduct')
export class CartProductController {
  constructor(private readonly _cartProduct: CartProductService) {}

  @Get()
  async getProductCart() {
    return await this._cartProduct.getProductCart();
  }

  @Get('/cart/:idCart/product/:idProduct')
  async checkProductInCart(
    @Param('idCart', ParseIntPipe) idCart: number,
    @Param('idProduct', ParseIntPipe) idProduct: number,
  ) {
    return await this._cartProduct.checkProductInCart(idProduct, idCart);
  }

  @Post("/increment/")
  @UseGuards(AuthGuard())
  async incrementQuantityProduct(
    @GetUser() userDto: UserDto,
    @Body('idProduct') idProduct: number,
  ) {
    return await this._cartProduct.incrementQuantityProduct(userDto, idProduct);
  }
  @Post("/decrement/")
  @UseGuards(AuthGuard())
  async decrementQuantityProduct(
    @GetUser() userDto: UserDto,
    @Body('idProduct') idProduct: number,
  ) {
    return await this._cartProduct.decrementQuantityProduct(userDto, idProduct);
  }

  @Get('/products/')
  @UseGuards(AuthGuard())
  async getProductsOfCart(@GetUser() userDto: UserDto) {
    return await this._cartProduct.getProductsOfCart(userDto);
  }
}
