import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { ConfigService } from '@nestjs/config';
import { get } from 'http';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private configService: ConfigService,
  ) {}

  @Get('product/list/:page')
  async listProducts(@Param('page', ParseIntPipe) page: number) {
    const products = await this.searchService.listProductsWhithFilters(page);
    const totalProducts = await this.searchService.totalProducts();
    const totalPages = Math.ceil(
      totalProducts / parseInt(this.configService.get('PRODUCT_PAGE')),
    );
    return { products: products, totalPages: totalPages };
  }
  @Get('product/list/:page/:categoryCanonical')
  async listProductsByCategory(
    @Param('page', ParseIntPipe) page: number,
    @Param('categoryCanonical') categoryCanonical: string,
  ) {
    const products = await this.searchService.listProductsWhithFilters(
      page,
      categoryCanonical,
    );
    const totalProducts =
      await this.searchService.totalProducts(categoryCanonical);
    const totalPages = Math.ceil(
      totalProducts / parseInt(this.configService.get('PRODUCT_PAGE')),
    );
    return { products: products, totalPages: totalPages };
  }
  @Get('product/list/:page/:categoryCanonical/:orderBy')
  async listProductsByCategoryOrderBy(
    @Param('page', ParseIntPipe) page: number,
    @Param('categoryCanonical') categoryCanonical: string,
    @Param('orderBy') orderBy: string,
  ) {
    categoryCanonical =
      categoryCanonical === 'all' ? undefined : categoryCanonical;
    const products = await this.searchService.listProductsWhithFilters(
      page,
      categoryCanonical,
      orderBy,
    );
    const totalProducts = await this.searchService.totalProducts(
      categoryCanonical,
      orderBy,
    );
    const totalPages = Math.ceil(
      totalProducts / parseInt(this.configService.get('PRODUCT_PAGE')),
    );
    return { products: products, totalPages: totalPages };
  }

  @Get('product/:page/:searchText')
  async searchProductsByText(
    @Param('page', ParseIntPipe) page: number,
    @Param('searchText') searchText: string,
  ) {
    const products = await this.searchService.listProductsWhithFilters(
      page,
      undefined,
      undefined,
      searchText,
    );
    const totalProducts = await this.searchService.totalProducts(
      undefined,
      searchText,
    );
    const totalPages = Math.ceil(
      totalProducts / parseInt(this.configService.get('PRODUCT_PAGE')),
    );
    return { products: products, totalPages: totalPages };
  }
}
