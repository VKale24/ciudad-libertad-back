import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { FavoriteService } from '../services/favorite.service';

@Controller('favorites')
@UseGuards(AuthGuard())
export class FavoriteController {
  constructor(private readonly _favoriteService: FavoriteService) {}

  @Get()
  async getFavoritesByUser(@GetUser() user: UserDto) {
    return await this._favoriteService.getFavoritesByUser(user);
  }
  @Get("/checkProduct/:idProduct")
  async checkProductInFavorites(
    @GetUser() user: UserDto,
    @Param("idProduct")idProduct: number
    ) {
    return await this._favoriteService.checkIsProductInFavorites(user, idProduct);
  }

  @Post()
  async createUser(
    @GetUser() user: UserDto,
    @Body('idProduct') idProduct: number,
  ) {
    return await this._favoriteService.addProductToFavorites(user, idProduct);
  }

  @Delete("/:idProduct")
  async deleteProductFromFavorites(
    @GetUser() user: UserDto,
    @Param('idProduct') idProduct: number,
  ){
    return await this._favoriteService.deleteProductFromFavorites(user, idProduct);
  }
}
