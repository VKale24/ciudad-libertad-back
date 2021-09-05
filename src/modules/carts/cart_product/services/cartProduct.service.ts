import { Injectable, NotFoundException } from '@nestjs/common';

import { CartProductRepository } from '../repositories/cart.repository';
import { CartRepository } from '../../cart/repositories/cart.repository';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class CartProductService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartProductRepository: CartProductRepository,
  ) {}

  async getProductCart() {
    const productCart = await this.cartProductRepository.find({
      relations: ['product', 'cart'],
    });

    return productCart;
  }

  async checkProductInCart(idProduct: number, idCart: number) {
    const product = await this.productRepository.findOne(idProduct);
    if (!product) throw new NotFoundException();

    const cart = await this.cartRepository.findOne(idCart, {
      relations: ['user'],
    });
    if (!cart) throw new NotFoundException();

    const found = await this.cartProductRepository
      .createQueryBuilder('cartProduct')
      .leftJoinAndSelect('cartProduct.cart', 'cart')
      .leftJoinAndSelect('cartProduct.product', 'product')
      .where('cartProduct.cart.idCart = :idCart', { idCart: idCart })
      .andWhere('cartProduct.product.idProduct = :idProduct', {
        idProduct: idProduct,
      })
      .getOne();

    if (found) return true;
    if (!found) return false;
  }

  async getProductsOfCart(userDto: UserDto) {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });
    if (!user) throw new NotFoundException();

    //Check if a user already have a cart
    const cart = await this.cartRepository.findOne({ user: user });

    if (!cart) throw new NotFoundException("This user don't have any cart");

    const products = await this.cartProductRepository
      .createQueryBuilder('cartProduct')
      .leftJoinAndSelect('cartProduct.cart', 'cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cartProduct.product', 'product')
      .leftJoinAndSelect('product.categoryProduct', 'categoryProduct')
      .leftJoinAndSelect('product.company', 'company')
      .leftJoinAndSelect('product.stateProduct', 'stateProduct')
      .where('cartProduct.cart.idCart = :idCart', { idCart: cart.idCart })
      .orderBy("cartProduct.idCartProduct", "ASC")
      .getMany();
    return products;
  }

  async incrementQuantityProduct(userDto: UserDto, idProduct: number) {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });
    if (!user) throw new NotFoundException();

    //Check if a user already have a cart
    const cart = await this.cartRepository.findOne({ user: user });

    if (!cart) throw new NotFoundException("This user don't have any cart");

    const product = await this.productRepository.findOne(idProduct);

    if (!product)
      throw new NotFoundException(
        `"Don't exist a product with ID: ${idProduct}"`,
      );

    const cartProduct = await this.cartProductRepository
      .createQueryBuilder('cartProduct')
      .leftJoin('cartProduct.cart', 'cart')
      .leftJoin('cartProduct.product', 'product')
      .where('cartProduct.cart = :idCart', { idCart: cart.idCart })
      .andWhere('cartProduct.product = :idProduct', {
        idProduct: product.idProduct,
      })
      .getOne();

    cartProduct.quantity = cartProduct.quantity + 1;
    await this.cartProductRepository.save(cartProduct);

    return cartProduct;
  }
  async decrementQuantityProduct(userDto: UserDto, idProduct: number) {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });
    if (!user) throw new NotFoundException();

    //Check if a user already have a cart
    const cart = await this.cartRepository.findOne({ user: user });

    if (!cart) throw new NotFoundException("This user don't have any cart");

    const product = await this.productRepository.findOne(idProduct);

    if (!product)
      throw new NotFoundException(
        `"Don't exist a product with ID: ${idProduct}"`,
      );

    const cartProduct = await this.cartProductRepository
      .createQueryBuilder('cartProduct')
      .leftJoin('cartProduct.cart', 'cart')
      .leftJoin('cartProduct.product', 'product')
      .where('cartProduct.cart = :idCart', { idCart: cart.idCart })
      .andWhere('cartProduct.product = :idProduct', {
        idProduct: product.idProduct,
      })
      .getOne();

    cartProduct.quantity = cartProduct.quantity - 1;
    await this.cartProductRepository.save(cartProduct);

    return cartProduct;
  }
}
