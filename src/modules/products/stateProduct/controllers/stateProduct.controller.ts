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
import { StateProductService } from '../services/stateProduct.service';

@Controller('stateProduct')
export class StateProductController {
  constructor(private readonly _stateProductService: StateProductService) {}

  @Get()
  async getStatesProduct() {
    return await this._stateProductService.getStateProducts();
  }

  @Get('/:id')
  async getStateProductById(@Param('id', ParseIntPipe) id: number) {
    return await this._stateProductService.getStateProductById(id);
  }

  @Post()
  async createStateProduct(
      @Body("name")name: string
  ) {
    return await this._stateProductService.createStateProduct(name);
  }

  @Patch('/:id')
  async updateStateProduct(
      @Param("id")id: number, 
      @Body("name")name: string
  ) {
    return await this._stateProductService.updateStateProduct(id,name);
  }

  @Delete('/:id')
  async deleteStateProduct(
      @Param("id")id: number
  ) {
    return await this._stateProductService.deleteStateProduct(id);
  }
}
