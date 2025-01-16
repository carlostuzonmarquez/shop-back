import { Controller, Post, Body, Get, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { EditCategoryDto } from './dto/editcategory.dto';
import { CreateCategoryDto } from './dto/createcategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('create')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.categoryService.createCategory(createCategoryDto);
    return JSON.stringify({ message: 'ok' })
  }

  @Get('list')
  listCategories() {
    return this.categoryService.getAll()

  }

  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    this.categoryService.deleteCategory(id);
    return this.categoryService.getAll()
  }

  @Patch('edit')
  updateCategory(@Body() editCategoryDto: EditCategoryDto) {
    this.categoryService.updateCategory(editCategoryDto);

  }
}
