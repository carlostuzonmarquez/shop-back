import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { PhotoService } from './photo.service';
import { existsSync, mkdirSync, unlink, unlinkSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { AuthGuard } from '@nestjs/passport';

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly phothoService: PhotoService,
    private readonly configService: ConfigService,
  ) { }
@Post('')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = `./uploads/tmp`;
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
          const filename =   Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36);

        const ext = extname(file.originalname);
        callback(null, `${filename}.jpg`); // ✅ sin símbolo $
      },
    }),
  }),
)
async uploadNewPhoto(@UploadedFile() file: Express.Multer.File) {
  return {
    photo: this.configService.get<string>('PHOTOS_TMP_URL') + file.filename,
    filename: file.filename,
  };
}


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
          const filename =   Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36);
          const ext = extname(file.originalname);
          callback(null, `${filename}${ext}`);
        },
      }),
    }),
  )
  async uploadEditPhoto(
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
  @Delete('by-filename/:filename')
  async deleteByFilename(@Param('filename') filename: string) {
    const photoPath = join('./uploads/tmp', filename);

    if (!existsSync(photoPath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    unlinkSync(photoPath); // Borra el archivo de forma síncrona

    return { message: 'Archivo eliminado correctamente' };
  }

}

