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
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { PhotoService } from './photo.service';
import { existsSync, mkdirSync, unlink } from 'fs';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { AuthGuard } from '@nestjs/passport';

@Controller('photo')
@UseGuards(AuthGuard('jwt'))
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly configService: ConfigService,
  ) {}
  @Post(':productId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Guardamos en memoria para procesarlo primero
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    if (!file) {
      throw new Error('No se ha subido ningún archivo');
    }

    const uploadPath = `./uploads/${productId}`; // Ruta del producto

    // Crear la carpeta si no existe
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const filePath = `${uploadPath}/${filename}`;

    try {
      // Redimensionar y recortar con Sharp
      await sharp(file.buffer)
        .resize(350, 350, {
          fit: 'cover', // Mantiene la proporción y recorta el exceso
          position: 'center', // Recorte centrado
        })
        .toFormat('jpeg') // Convertir a JPEG
        .toFile(filePath);

      // Guardar en la base de datos
      const photo = await this.photoService.createPhoto(productId, filename);

      return {
        preview: `${this.configService.get<string>('PHOTOS_BASE_URL')}${productId}/${filename}`,
        filename: filename,
        id: photo.id,
        path: photo.path,
      };
    } catch (error) {
      throw new Error(`Error procesando la imagen: ${error.message}`);
    }
  }

  @Delete(':id')
  async deletePhoto(@Param('id', ParseIntPipe) id: number) {
    const unlinkAsync = promisify(unlink);
    const photo = await this.photoService.findById(id);
    const photoPath = './uploads/' + photo.path;
    if (existsSync(photoPath)) {
      await unlinkAsync(photoPath);
    }
    this.photoService.deletePhoto(id);
    return { message: 'ok' };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Guardamos en memoria para procesarlo antes de escribirlo en disco
    }),
  )
  async uploadTempPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No se ha subido ningún archivo');
    }

    const uploadPath = `./uploads/tmp`; // Carpeta temporal

    // Crear la carpeta si no existe
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const filePath = `${uploadPath}/${filename}`;

    try {
      // Redimensionar y recortar con Sharp
      await sharp(file.buffer)
        .resize(350, 350, {
          fit: 'cover', // Mantiene la proporción y recorta el exceso
          position: 'center', // Recorte centrado
        })
        .toFormat('jpeg') // Convertir a JPEG para mejor compatibilidad
        .toFile(filePath);

      return {
        preview: `${this.configService.get<string>('PHOTOS_BASE_URL')}tmp/${filename}`,
        filename: filename,
      };
    } catch (error) {
      throw new Error(`Error procesando la imagen: ${error.message}`);
    }
  }

  @Delete('tmp/:filename')
  deleteTmpPhoto(@Param('filename') filename: string) {
    try {
      fs.unlinkSync(path.resolve(process.cwd(), 'uploads/tmp/' + filename));
      return { message: 'ok' };
    } catch (err) {
      return { errorResponse: { message: ['Can not delete the photo'] } };
    }
  }
}
