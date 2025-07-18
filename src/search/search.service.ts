import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { contains } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
  async listProductsWhithFilters(
    page: number,
    categoryCanonical?: string,
    orderBy?: string,
    searchText?: string,
  ) {
    let whereConditions = {};
    if (categoryCanonical) {
      whereConditions = {
        ProductCategory: {
          //alguno que tenga la categoria cacanonical
          some: {
            category: {
              canonical: {
                equals: categoryCanonical,
              },
            },
          },
        },
      };
    } else if (searchText) {
      whereConditions = {
        OR: [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ],
      };
    }
    const orderByConditions = orderBy
      ? {
          [orderBy]: orderBy === 'name' ? 'asc' : 'desc',
        }
      : {};

    return await this.prismaService.product.findMany({
      skip: (page - 1) * this.configService.get('PRODUCT_PAGE'), // skip inicio
      take: parseInt(this.configService.get('PRODUCT_PAGE')), //take cuantos quieres que coja
      orderBy: orderByConditions,
      include: {
        ProductCategory: {
          include: { category: true },
        },
        Photos: true,
      },
      where: whereConditions,
    });
  }

  async totalProducts(categoryCanonical?: string, searchText?: string) {
    let whereConditions = {};
    if (categoryCanonical) {
      whereConditions = {
        ProductCategory: {
          //alguno que tenga la categoria cacanonical
          some: {
            category: {
              canonical: {
                equals: categoryCanonical,
              },
            },
          },
        },
      };
    } else if (searchText) {
      whereConditions = {
        OR: [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ],
      };
    }
    return await this.prismaService.product.count({
      where: whereConditions,
    });
  }
}
