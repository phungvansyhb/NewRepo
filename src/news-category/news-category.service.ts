import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/updateOrderDto';

@Injectable()
export class NewsCategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNewsCategoryDto: Prisma.news_categoryCreateInput) {
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

  async findAll() {
    const data = await this.prismaService.news_category.findMany();
    const count = await this.prismaService.news_category.count();
    return { data: data, count: count };
  }

  findOne(id: string) {
    return this.prismaService.news_category.findFirstOrThrow({
      where: { id: id },
    });
  }

  async update(
    id: string,
    updateNewsCategoryDto: Prisma.news_categoryCreateInput,
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

  async updateOrder(data: UpdateOrderDto) {
    const promises = data.data.map(({ id, order }) =>
      this.prismaService.news_category.update({
        where: { id },
        data: { order: order },
      }),
    );
    await Promise.all(promises);
    return { message: 'Order updated successfully' };
  }
}
