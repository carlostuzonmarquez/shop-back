import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotoService } from 'src/photo/photo.service';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports:[PhotoModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService]
})
export class ProductModule { }
