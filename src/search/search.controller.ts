import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { ConfigService } from '@nestjs/config';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService ,private configService:ConfigService) {}

  @Get("product/list/:page")
  async listProducts(@Param("page",ParseIntPipe) page:number){
    const products= await this.searchService.listProducts(page)
    const totalProducts = await this.searchService.totalProducts();
    const totalPages=Math.ceil(
      totalProducts /
      parseInt(this.configService.get("PRODUCT_PAGE")))
    return {products:products ,totalPages:totalPages}
  }
}

