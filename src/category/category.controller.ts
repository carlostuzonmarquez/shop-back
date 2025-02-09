import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { EditCategoryDto } from './dto/editcategory.dto';
import { CreateCategoryDto } from './dto/createcategory.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('create')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.categoryService.createCategory(createCategoryDto);
    return JSON.stringify({ message: 'ok' });
  }

  @Get('list')
  listCategories() {
    return this.categoryService.getAll();
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.deleteCategory(id);
    return this.categoryService.getAll();
  }

  @Patch('edit')
  updateCategory(@Body() editCategoryDto: EditCategoryDto) {
    this.categoryService.updateCategory(editCategoryDto);
    return JSON.stringify({ message: 'ok' });
  }
}
