import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ProductService } from './product.service';
import { EditProductDto } from './dto/EditProductDto';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';
import { PhotoService } from 'src/photo/photo.service';

@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly photoService: PhotoService,
  ) {}

  @Post('create')
  async createProduct(@Body() createProduct: CreateProductDto) {
    const product = await this.productService.createProduct(createProduct);
    const tmpFolderPath = path.resolve(process.cwd(), 'uploads/tmp');
    const productFolderPath = path.resolve(
      process.cwd(),
      'uploads/' + product.id,
    );

    if (!fs.existsSync(productFolderPath))
      fs.mkdirSync(productFolderPath, { recursive: true });

    createProduct.photos.forEach((photo) => {
      fs.renameSync(
        tmpFolderPath + '/' + photo,
        productFolderPath + '/' + photo,
      );
      this.photoService.createPhoto(product.id, photo);
    });

    return { message: 'ok' };
  }
  @Get('list')
  listProduct() {
    return this.productService.getAll();
  }
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productService.findById(id);
      if (product.Photos.length > 0) {
        product.Photos.map((photo) => {
          fs.unlinkSync(path.resolve(process.cwd(), 'uploads/' + photo.path));
        });
      }
      await this.productService.deleteProduct(id);
      return { message: 'ok' };
    } catch (err) {
      console.log(err);
      return { message: 'Cannot delete the product with id: ' + id };
    }
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
