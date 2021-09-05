import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from 'src/modules/products/product/product.entity';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { FavoriteEntity } from '../favorite.entity';
import { FavoriteRepository } from '../repositories/favorite.repository';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async getFavoritesByUser(userDto: UserDto) {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) throw new NotFoundException();

    const favorites = await this.favoriteRepository
      .createQueryBuilder('favorites')     
      .leftJoinAndSelect('favorites.user', 'user')
      .leftJoinAndSelect('favorites.product', 'product')
      .leftJoinAndSelect('product.company', 'company')     
      .leftJoinAndSelect('product.categoryProduct', 'categoryProduct')
      .leftJoinAndSelect('product.stateProduct', 'stateProduct')
      .where('favorites.user.idUser = :idUser', { idUser: user.idUser })
      .getMany();

    return favorites;
  }
  async checkIsProductInFavorites(userDto: UserDto, idProduct: number) {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) throw new NotFoundException();
    
    const product = await this.productRepository.findOne(idProduct);
    if (!product) throw new NotFoundException();

    const favorite = await this.favoriteRepository
      .createQueryBuilder('favorites')
      .leftJoinAndSelect('favorites.user', 'user')
      .leftJoinAndSelect('favorites.product', 'product')
      .where('favorites.user.idUser = :idUser', { idUser: user.idUser })
      .where('favorites.product.idProduct = :idProduct', { idProduct: idProduct })
      .getOne();

      if(favorite) return true;

       return false;
  }

  async addProductToFavorites(userDto: UserDto, idProduct: number) {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) throw new NotFoundException();

    const product = await this.productRepository.findOne(idProduct);

    if (!product) throw new NotFoundException();

    const found = await this.favoriteRepository
      .createQueryBuilder('favorites')
      .leftJoinAndSelect('favorites.user', 'user')
      .leftJoinAndSelect('favorites.product', 'product')
      .where('favorites.user.idUser = :idUser', { idUser: user.idUser })
      .andWhere('favorites.product.idProduct = :idProduct', {
        idProduct: product.idProduct,
      })
      .getOne();

    var favorite;
    if (!found) {
      favorite = new FavoriteEntity(user, product);
      await this.favoriteRepository.save(favorite);
      return favorite;
    }

    return 'El elemento ya existe en los favoritos';
  }

  async deleteProductFromFavorites(userDto: UserDto, idProduct: number) {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) throw new NotFoundException();

    const product = await this.productRepository.findOne(idProduct);

    if (!product) throw new NotFoundException();

    const productFound = await this.favoriteRepository
      .createQueryBuilder('favorites')
      .leftJoinAndSelect('favorites.user', 'user')
      .leftJoinAndSelect('favorites.product', 'product')
      .where('favorites.user.idUser = :idUser', { idUser: user.idUser })
      .andWhere('favorites.product.idProduct = :idProduct', {
        idProduct: product.idProduct,
      })
      .getOne();

    if (!productFound) throw new NotFoundException();

    const result = await this.favoriteRepository.delete(productFound);

    return Promise.resolve({
      result: result,
      status: 'success',
    });
  }
}
