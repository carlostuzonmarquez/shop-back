import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { canonicalize } from 'src/helpers/helpers';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(createCategoryDto: CategoryDto) {
    await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        canonical: canonicalize(createCategoryDto.name),
      },
    });
  }
}
