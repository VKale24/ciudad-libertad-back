import { Exclude } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductDto } from 'src/modules/products/product/dto/product.dto';

@Exclude()
export class SaleDto {
  @IsString()
  @IsNotEmpty()
  adress: string;

  @IsNumber()
  @IsNotEmpty()
  payment: number;

}
