import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { LoggerService } from 'src/logger/logger.service';
import { LoginedUser } from 'auth.middleware';

@Injectable()
export class NewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async create(createNewsDto: CreateNewsDto, user: LoginedUser) {
    try {
      const { category_id, assignedUsers, ...data } = createNewsDto;
      const existingNewsName = await this.prismaService.news.findFirst({
        where: { title: createNewsDto.title },
      });
      if (existingNewsName) {
        return {
          statusCode: 400,
          message: 'Title name already exists',
        };
      }
      return this.prismaService.news.create({
        data: {
          ...data,
          created_by: user?.['additional-data'].username,
          category: {
            connect: { id: category_id },
          },
          users: {
            connect: assignedUsers?.map((item: string) => ({
              id: item,
            })),
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll(
    params: { page: number; size: number; categoryName?: string },
    user: LoginedUser,
  ) {
    try {
      /**
       * TODO filter by user called request
       */
      // const idRequest = user['additional-data'].id;
      const data = await this.prismaService.news.findMany({
        take: params.size,
        skip: (params.page - 1) * params.size,
        orderBy: { last_modified_ts: 'desc' },
        include: { category: true },
        where: {
          category: {
            name: params.categoryName ?? undefined,
          },
          // users: {
          //   some: { id: idRequest },
          // },
        },
      });
      const count = await this.prismaService.news.count();
      return {
        data: data,
        count: count,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  findOne(id: string) {
    try {
      return this.prismaService.news.findFirstOrThrow({
        where: { id: id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  findByTitle(title: string) {
    try {
      return this.prismaService.news.findFirstOrThrow({
        where: { title: title },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(id: string, updateNewsDto: Partial<CreateNewsDto>) {
    try {
      const { category_id, ...data } = updateNewsDto;
      const oldNews = await this.prismaService.news.findUnique({
        where: { id: id },
        include: { users: true },
      });
      const existingNewsName = await this.prismaService.news.findFirst({
        where: { title: updateNewsDto.title, id: { not: id } },
      });
      if (existingNewsName) {
        return {
          statusCode: 400,
          message: 'Title name already exists',
        };
      }
      const category =
        oldNews?.category_id !== category_id
          ? {
              disconnect: { id: oldNews?.category_id },
              connect: { id: category_id },
            }
          : undefined;
      const users = !this.compareTwoArray(
        oldNews?.users.map((item) => item.id) || [],
        updateNewsDto.assignedUsers || [],
      )
        ? {
            connect: updateNewsDto.assignedUsers?.map((item: string) => ({
              id: item,
            })),
          }
        : undefined;

      return this.prismaService.news.update({
        where: { id: id },
        data: {
          ...data,
          category: category,
          users: users,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  compareTwoArray<T>(array1: T[], array2: T[]) {
    return (
      array1.length === array2.length &&
      array1.every((value, index) => value === array2[index])
    );
  }
}
