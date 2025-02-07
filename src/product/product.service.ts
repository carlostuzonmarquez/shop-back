import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { canonicalize } from 'src/helpers/helpers';
import { EditProductDto } from './dto/EditProductDto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  //crear
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

    createProductDto.categories.forEach(async (categoryId) => {
      await this.prismaService.productCategory.create({
        data: {
          productId: product.id,
          categoryId: categoryId,
        },
      });
    });
  }
  async getAll() {
    return await this.prismaService.product.findMany({
      include: {
        ProductCategory: {
          include: { category: true },
        },
      },
    });
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
        ProductCategory: true,
      },
    });
  }
}
