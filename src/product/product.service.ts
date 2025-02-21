import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { canonicalize } from 'src/helpers/helpers';
import { EditProductDto } from './dto/EditProductDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
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

    return product;
  }
  async getAllWithFilters(page: number) {
    const findManyParams: {
      include: object;
      skip?: number;
      take?: number;
    } = {
      include: {
        ProductCategory: {
          include: { category: true },
        },
        Photos: true,
      },
    };

    if (page > 0) {
      const productsPerPage = parseInt(
        this.configService.get('PRODUCTS_PER_PAGE'),
      );
      findManyParams.skip = (page - 1) * productsPerPage;
      findManyParams.take = productsPerPage;
    }

    const totalProducts = await this.prismaService.product.count();

    return {
      products: await this.prismaService.product.findMany(findManyParams),
      count: totalProducts,
      totalPages: Math.ceil(
        totalProducts / this.configService.get('PRODUCTS_PER_PAGE'),
      ),
    };
  }

  async getAll() {
    return await this.prismaService.product.findMany({
      orderBy: { id: 'desc' },
      include: {
        ProductCategory: {
          include: { category: true },
        },
        Photos: true,
      },
    });
  }

  async deleteProduct(id: number) {
    await this.prismaService.product.delete({ where: { id } });
  }

  async updateProduct(id: number, editProductDto: EditProductDto) {
    await this.prismaService.product.update({
      where: { id },
      data: {
        name: editProductDto.name,
        canonical: canonicalize(editProductDto.name),
        description: editProductDto.description,
        stock: editProductDto.stock,
        price: editProductDto.price,
      },
    });

    await this.prismaService.productCategory.deleteMany({
      where: { productId: id },
    });

    editProductDto.categories.forEach(async (categoryId) => {
      await this.prismaService.productCategory.create({
        data: {
          productId: id,
          categoryId: categoryId,
        },
      });
    });
  }
  async findById(id: number) {
    return await this.prismaService.product.findUnique({
      where: { id },
      include: {
        ProductCategory: true,
        Photos: true,
      },
    });
  }
}
