import { Controller, Post, Body } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(@Body() createCategoryDto: CategoryDto) {
    this.categoryService.createCategory(createCategoryDto);
  }
}
