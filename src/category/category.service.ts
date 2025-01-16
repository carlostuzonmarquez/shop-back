import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { canonicalize } from 'src/helpers/helpers';
import { CreateCategoryDto } from './dto/createcategory.dto';
import { EditCategoryDto } from './dto/editcategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) { }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        canonical: canonicalize(createCategoryDto.name),
      },
    });
  }

  async getAll() {
    return await this.prismaService.category.findMany()
  }

  async deleteCategory(id: number) {
    await this.prismaService.category.delete({ where: { id } })
  }

  async updateCategory(editCategoryDto: EditCategoryDto) {
    return await this.prismaService.category.update({
      where: { id: parseInt(editCategoryDto.id) },
      data: { name: editCategoryDto.name, canonical: canonicalize(editCategoryDto.name) }
    });
  }
}
