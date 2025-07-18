import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { EditProductDto } from './dto/EditProductDto';
import { canonicalize } from 'src/helpers/helpers';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const product = await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        canonical: canonicalize(createProductDto.name),
        stock: createProductDto.stock,
        description: createProductDto.description,
        price: createProductDto.price,
      },
    });

    for (const categoryId of createProductDto.categories) {
      await this.prismaService.productCategory.create({
        data: {
          productId: product.id,
          categoryId: categoryId,
        },
      });
    }

    return product;
  }

  async getAll() {
    const productos = await this.prismaService.product.findMany({
      include: {
        productCategory: {
          include: {
            category: true,
          },
        },
        Photos: true,
      },
    });
    return productos.map((product) => ({
      ...product,
      categories: product.productCategory.map((pc) => pc.category),
    }));
  }

  async deleteProduct(id: number) {
    await this.prismaService.product.delete({ where: { id } });
  }

  async updateProduct(editProductDto: EditProductDto) {
    return await this.prismaService.product.update({
      where: { id: editProductDto.id },
      data: {
        name: editProductDto.name,
        canonical: canonicalize(editProductDto.name),
        description: editProductDto.description,
        stock: editProductDto.stock,
        price: editProductDto.price,
      },
    });
  }

  async findById(id: number) {
    return await this.prismaService.product.findUnique({
      where: { id },
      include: {
        productCategory: {
          include: {
            category: true,
          },
        },
        Photos: true,
      },
    });
  }
}
