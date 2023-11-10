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
import { Request } from 'express';
@Controller('news-category')
export class NewsCategoryController {
  constructor(private readonly newsCategoryService: NewsCategoryService) {}

  @Post()
  @Version('1')
  async create(
    @Body() createNewsCategoryDto: Prisma.news_categoryCreateInput,
    @Req() request: Request,
  ) {
    const currentUser = request.headers.locals;
    return this.newsCategoryService.create(createNewsCategoryDto);
  }

  @Get(':id')
  @Version('1')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.newsCategoryService.findOne(id);
  }

  @Get()
  @Version('1')
  async findAll(@Req() request: Request) {
    const currentUser = request.headers.data;
    return this.newsCategoryService.findAll();
  }
  @Patch('update-order')
  @Version('1')
  async updateOrder(@Body() data: UpdateOrderDto) {
    return this.newsCategoryService.updateOrder(data);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNewsCategoryDto: Prisma.news_categoryCreateInput,
  ) {
    return this.newsCategoryService.update(id, updateNewsCategoryDto);
  }
}
