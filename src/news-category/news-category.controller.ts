import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Version,
} from '@nestjs/common';
import { NewsCategoryService } from './news-category.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';
import { UpdateOrderDto } from './dto/updateOrderDto';
@Controller('news-category')
export class NewsCategoryController {
  constructor(
    private readonly newsCategoryService: NewsCategoryService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @Version('1')
  async create(
    @Body() createNewsCategoryDto: Omit<Prisma.news_categoryCreateInput, 'id'>,
  ) {
    // Check if the name already exists
    const existingCategory = await this.prismaService.news_category.findFirst({
      where: { name: createNewsCategoryDto.name },
    });

    if (existingCategory) {
      return {
        statusCode: 400,
        message: 'Category name is exist',
      };
    }
    let order = 1;
    const maxOrder = await this.prismaService.news_category.findFirst({
      orderBy: {
        order: 'desc',
      },
      take: 1,
    });
    if (maxOrder) {
      order = maxOrder.order + 1;
    }
    return this.prismaService.news_category.create({
      data: {
        ...createNewsCategoryDto,
        order,
      },
    });
  }

  @Get(':id')
  @Version('1')
  find(@Param('id', ParseUUIDPipe) id: string) {
    return this.prismaService.news_category.findFirstOrThrow({
      where: { id: id },
    });
  }

  @Get()
  @Version('1')
  async findAll() {
    const data = await this.prismaService.news_category.findMany();
    const count = await this.prismaService.news_category.count();
    return { data: data, count: count };
  }
  @Patch('update-order')
  @Version('1')
  async updateOrder(@Body() data: UpdateOrderDto) {
    const promises = data.data.map(({ id, order }) =>
      this.prismaService.news_category.update({
        where: { id },
        data: { order: order },
      }),
    );
    await Promise.all(promises);
    return { message: 'Order updated successfully' };
  }
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNewsCategoryDto: UpdateNewsCategoryDto,
  ) {
    // Check if the record exists
    const existingCategory = await this.prismaService.news_category.findFirst({
      where: { id: id },
    });

    if (!existingCategory) {
      return {
        statusCode: 404,
        message: 'Record not found',
      };
    }

    return this.prismaService.news_category.update({
      where: { id: id },
      data: updateNewsCategoryDto,
    });
  }
}
