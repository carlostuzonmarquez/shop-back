import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PhotoService } from './photo.service';
import { existsSync, mkdirSync, unlink } from 'fs';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { AuthGuard } from '@nestjs/passport';

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly phothoService: PhotoService,
    private readonly configService: ConfigService,
  ) { }
  @Post(':productId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const productId = req.params.productId;
          const uploadPath = `./uploads/${productId}`; // Ruta dinámica para cada producto

          // Crear la  carpeta si no existe
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath); // Define el destino como la carpeta del producto
        },

        filename: (req, file, callback) => {
          const filename = Date.now() + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${filename}${ext}`);
        },
      }),
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    await this.phothoService.createPhoto(productId, file.filename);
    return {
      photo:
        this.configService.get<string>('PHOTOS_BASE_URL') +
        productId +
        '/' +
        file.filename,
    };
  }
  @Delete(':id')
  async deletePhoto(@Param('id', ParseIntPipe) id: number) {
    const unlinkAsync = promisify(unlink);
    const photo = await this.phothoService.findById(id);
    const photoPath = './uploads/' + photo.path;
    if (existsSync(photoPath)) {
      unlinkAsync(photoPath);
    }
    this.phothoService.deletePhoto(id);
  }
}
