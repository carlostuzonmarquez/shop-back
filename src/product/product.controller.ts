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
import * as sharp from 'sharp';

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
  @Get('list/:page')
  getPaginatedProducts(@Param('page', ParseIntPipe) page: number) {
    return this.productService.getAllWithFilters(page, undefined);
  }

  @Get('list/:page/:categoryCanonical')
  getPaginatedCategoryProducts(
    @Param('page', ParseIntPipe) page: number,
    @Param('categoryCanonical') categoryCanonical: string,
  ) {
    return this.productService.getAllWithFilters(page, categoryCanonical);
  }

  @Get('all')
  getAll() {
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
      return { message: 'Cannot delete the product with id: ' + id };
    }
  }
  @Patch(':id')
  updateProduct(
    @Body() editProductDto: EditProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.productService.updateProduct(id, editProductDto);
    return { message: 'ok' };
  }
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  /*@Get('set/images')
  async setImages() {
    const products = await this.productService.getAll();
    products.forEach(async (product) => {
      const productFolderPath = path.resolve(
        process.cwd(),
        'uploads/' + product.id,
      );
      if (!fs.existsSync(productFolderPath))
        fs.mkdirSync(productFolderPath, { recursive: true });

      for (let i = 0; i < 3; i++) {
        const imageName = await this.getRandomImage(product.id);
        this.photoService.createPhoto(product.id, imageName);
      }
    });
    return { message: 'ok' };
  }

  async getRandomImage(outputPath: number) {
    const imageFolder = process.cwd() + '/uploads/tmp/';
    const files = fs.readdirSync(imageFolder);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    if (imageFiles.length === 0) {
      throw new Error('No image files found in the directory');
    }

    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const randomImageFile = imageFiles[randomIndex];
    const imagePath = path.join(imageFolder, randomImageFile);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(randomImageFile)}`;
    // Resize the image to 600x600 using sharp and save it to the output path
    console.log();
    await sharp(imagePath)
      .resize(600, 600, {
        fit: 'cover',
      })
      .toFile(process.cwd() + '/uploads/' + outputPath + '/' + filename);

    return filename;
  }*/
}
