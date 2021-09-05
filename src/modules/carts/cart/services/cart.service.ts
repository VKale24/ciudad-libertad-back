import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { CartProductEntity } from '../../cart_product/cartProduct.entity';
import { CartProductRepository } from '../../cart_product/repositories/cart.repository';
import { CartProductService } from '../../cart_product/services/cartProduct.service';
import { CartEntity } from '../cart.entity';
import { CartRepository } from '../repositories/cart.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartProductRepository: CartProductRepository,
    private readonly _cartProductService: CartProductService
  ) {}

  async getCarts(): Promise<CartEntity[]> {
    const carts = await this.cartRepository.find({ relations: ['user'] });

    return carts;
  }

  async getCartById(idCart: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne(idCart, {
      relations: ['user'],
    });

    if (!cart) throw new NotFoundException();

    return cart;
  }

  async getCartByUser(userDto: UserDto): Promise<CartEntity> {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });
    if (!user) throw new NotFoundException();

    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .where('cart.user.idUser = :idUser', { idUser: user.idUser })
      .getOne();

    if (!cart) throw new NotFoundException();

    return cart;
  }
  async getUserByCart(idCart: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne(idCart, {
      relations: ['user'],
    });

    if (!cart) throw new NotFoundException();

    return cart;
  }

  async assignProductToCart(
    userDto: UserDto,
    products: [{ idProduct: number; quantity: number }],
  ): Promise<CartEntity> {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });
    if (!user) throw new NotFoundException();

    //Check if a user already has a cart
    const cart = await this.cartRepository.findOne({ where: { user: user }, relations: ["user"] });

    //var newCart;
    var result;
    if (cart == undefined) {
      const newCart = new CartEntity(user);
      result = await this.cartRepository.save(newCart);
    }
    var cartProduct;
    products.map(async (prod) => {
      if (cart != undefined) {
        console.log("entro");
        const product = await this.productRepository.findOne(prod.idProduct);

        const isProductInCart = await this._cartProductService.checkProductInCart(product.idProduct, cart.idCart);

        if(!isProductInCart){
          const cartProduct = new CartProductEntity(cart, product, prod.quantity);
          await this.cartProductRepository.save(cartProduct);
        }
      } else {
        const product = await this.productRepository.findOne(prod.idProduct);
        cartProduct = new CartProductEntity(
          result,
          product,
          prod.quantity,
        );
        await this.cartProductRepository.save(cartProduct);
      }
    });

    return cartProduct;
  }

  async deleteProductOnCart(userDto: UserDto, idProduct: number) {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });
    if (!user) throw new NotFoundException();

    //Check if a user already have a cart
    const cart = await this.cartRepository.findOne({ where: { user: user }, relations: ["user"] });

    if (!cart) throw new NotFoundException("This user don't have any cart");

    const product = await this.productRepository.findOne({
      idProduct,
    });
    if (!product)
      throw new NotFoundException(
        `A product with id: ${idProduct} don't exist`,
      );
       
       const cartProduct = await this.cartProductRepository.createQueryBuilder("cartProduct")
        .leftJoinAndSelect("cartProduct.cart", "cart")
        .leftJoinAndSelect("cartProduct.product", "product")
        .where("cartProduct.cart.idCart = :idCart", {idCart: cart.idCart})
        .andWhere("cartProduct.product.idProduct = :idProduct", {idProduct: product.idProduct})
        .getOne();

    const result = await this.cartProductRepository.delete(cartProduct);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }

  async deleteCart(idCart: number) {
    const cart = await this.getCartById(idCart);

    const result = await this.cartRepository.delete(cart);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
