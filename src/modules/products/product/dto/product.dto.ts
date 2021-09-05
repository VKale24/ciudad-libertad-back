import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class ProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  images: string;

  @IsNumber()
  offert: number;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  calification: number;
  
}
