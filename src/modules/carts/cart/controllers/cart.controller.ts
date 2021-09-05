import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { CartEntity } from '../cart.entity';
import { CartService } from '../services/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly _cartService: CartService) {}

  //ADMIN
  @Get()
  async getCarts(): Promise<CartEntity[]> {
    return await this._cartService.getCarts();
  }

   //USER
  @Get('/user/')
  @UseGuards(AuthGuard())
  async getCartByUser(@GetUser() userDto: UserDto): Promise<CartEntity> {

    return await this._cartService.getCartByUser(userDto);
  }

  //ADMIN
  @Get('/:id')
  async getCartById(
    @Param('id', ParseIntPipe) idCart: number,
  ): Promise<CartEntity> {
    return await this._cartService.getCartById(idCart);
  }
 

  @Post()
  @UseGuards(AuthGuard())
  async assignProductToCart(
    @GetUser() userDto: UserDto,
    @Body('products') products: [{ idProduct: number; quantity: number }],
  ): Promise<CartEntity> {
    return await this._cartService.assignProductToCart(userDto, products);
  }

  @Delete('/deleteProduct/:idProduct')
  @UseGuards(AuthGuard())
  async deleteProductOnCart(
    @GetUser() userDto: UserDto,
    @Param('idProduct') idProduct: number,
  ) {
   
    return await this._cartService.deleteProductOnCart(userDto, idProduct);
  }

  @Delete('/:idCart')
  async deleteCart(@Param('idCart') idCart: number) {
    return await this._cartService.deleteCart(idCart);
  }
}
