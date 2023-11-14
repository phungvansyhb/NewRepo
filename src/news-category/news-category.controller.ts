import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Version,
  Req,
} from '@nestjs/common';
import { NewsCategoryService } from './news-category.service';
import { Prisma } from '@prisma/client';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { Permissions } from 'src/roles/role.decorator';
import { ApiTags , ApiHeader } from '@nestjs/swagger'


@ApiTags('News-category')
@Controller('news-category')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
export class NewsCategoryController {
  constructor(private readonly newsCategoryService: NewsCategoryService) { }

  @Post()
  @Version('1')
  @Permissions(['R_CATEGORY_EXECUTE'])
  
  async create(@Body() createNewsCategoryDto: Prisma.news_categoryCreateInput) {
    return this.newsCategoryService.create(createNewsCategoryDto);
  }

  @Get(':id')
  @Version('1')
  @Permissions(['R_CATEGORY_EXECUTE'])
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.newsCategoryService.findOne(id);
  }

  @Get()
  @Version('1')
  @Permissions(['R_CATEGORY_EXECUTE'])
  async findAll() {
    return this.newsCategoryService.findAll();
  }

  @Patch('update-order')
  @Version('1')
  @Permissions(['R_CATEGORY_EXECUTE'])
  async updateOrder(@Body() data: UpdateOrderDto) {
    return this.newsCategoryService.updateOrder(data);
  }

  @Patch(':id')
  @Permissions(['R_CATEGORY_EXECUTE'])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNewsCategoryDto: Prisma.news_categoryCreateInput,
  ) {
    return this.newsCategoryService.update(id, updateNewsCategoryDto);
  }
}
