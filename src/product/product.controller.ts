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
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ProductService } from './product.service';
import { EditProductDto } from './dto/EditProductDto';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { PhotoService } from 'src/photo/photo.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly photoService: PhotoService,
  ) {}

  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    // 1. Crear producto
    const product = await this.productService.createProduct(createProductDto);

    // 2. Crear carpeta final del producto
    const productFolder = `./uploads/${product.id}`;
    if (!existsSync(productFolder)) {
      mkdirSync(productFolder, { recursive: true });
    }

    // 3. Mover fotos desde /tmp y registrar en DB
    for (const filename of createProductDto.photos) {
      const tmpPath = `./uploads/tmp/${filename}`;
      const finalPath = `${productFolder}/${filename}`;

      if (existsSync(tmpPath)) {
        renameSync(tmpPath, finalPath);
        await this.photoService.createPhoto(product.id, filename);
      }
    }

    return {
      message: 'Producto creado con fotos',
      product,
      photos: createProductDto.photos,
    };
  }

  @Get('list')
  listProduct() {
    return this.productService.getAll();
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);
    return this.productService.getAll();
  }

  @Patch('edit')
  updateProduct(@Body() editProductDto: EditProductDto) {
    this.productService.updateProduct(editProductDto);
    return { message: 'ok' };
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }
}
