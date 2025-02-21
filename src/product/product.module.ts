import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotoService } from 'src/photo/photo.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PhotoService, ConfigService],
})
export class ProductModule {}
