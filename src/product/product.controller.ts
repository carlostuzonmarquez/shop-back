import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ProductService } from './product.service';
import { EditProductDto } from './dto/EditProductDto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('create')
    createProduct(@Body() createProduct: CreateProductDto) {
        this.productService.createProduct((createProduct))
        return JSON.stringify({ message: 'ok' })
    }
    @Get('list')
    listProduct() {
        return this.productService.getAll()
    }
    @Delete(':id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        await this.productService.deleteProduct(id);
        return this.productService.getAll()
    }
    @Patch('edit')
    updateProduct(@Body() editProductDto: EditProductDto) {
        this.productService.updateProduct(editProductDto);
        return JSON.stringify({ message: 'ok' })
    }
    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findById(id)
    }
}
