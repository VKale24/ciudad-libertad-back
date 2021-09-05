import { Controller, Get, Param } from "@nestjs/common";
import { ProductSaleService } from "../services/productSale.service";

@Controller("productSale")
export class ProductSaleController{
    
    constructor(private readonly productSaleService: ProductSaleService){}

    @Get()
    async getProductSale(){
        return await this.productSaleService.getProductSale();
    }
    @Get("/sale/:id")
    async getProductBySale(
        @Param("id") idSale: number
    ){
        return await this.productSaleService.getProductBySale(idSale);
    }
}