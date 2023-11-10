import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { LoggerService } from 'src/logger/logger.service';
import { ContextService } from 'src/auth/context.service';

@Injectable()
export class NewsCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
    private readonly context: ContextService,
  ) {}

  async create(createNewsCategoryDto: Prisma.news_categoryCreateInput) {
    try {
      const existingCategory = await this.prismaService.news_category.findFirst(
        {
          where: { name: createNewsCategoryDto.name },
        },
      );

      if (existingCategory) {
        return {
          statusCode: 400,
          message: 'Category name already exists',
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
    } catch (error) {
      this.logger.error('Error in create method:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prismaService.news_category.findMany();
      const count = await this.prismaService.news_category.count();
      return { data: data, count: count };
    } catch (error) {
      this.logger.error('Error in findAll method:', error);
      throw error;
    }
  }

  findOne(id: string) {
    try {
      return this.prismaService.news_category.findFirstOrThrow({
        where: { id: id },
      });
    } catch (error) {
      this.logger.error('Error in findOne method:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateNewsCategoryDto: Prisma.news_categoryCreateInput,
  ) {
    try {
      const existingCategory = await this.prismaService.news_category.findFirst(
        {
          where: { id: id },
        },
      );

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
    } catch (error) {
      this.logger.error('Error in update method:', error);
      throw error;
    }
  }

  async updateOrder(data: UpdateOrderDto) {
    try {
      const promises = data.data.map(({ id, order }) =>
        this.prismaService.news_category.update({
          where: { id },
          data: { order: order },
        }),
      );
      await Promise.all(promises);
      return { message: 'Order updated successfully' };
    } catch (error) {
      this.logger.error('Error in updateOrder method:', error);
      throw error;
    }
  }
}
