import { Injectable, Scope, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { LoggerService } from 'src/logger/logger.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { LoginedUser } from 'auth.middleware';
import { Prisma } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class NewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
    @Inject(REQUEST) private request: Request,
  ) { }

  async create(createNewsDto: CreateNewsDto) {
    try {
      const currentUser = JSON.parse(
        this.request.headers.data as string,
      ) as LoginedUser;
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
          created_by: currentUser?.['additional-data'].username,
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

  // async findAll(params: {
  //   page: number;
  //   size: number;
  //   categoryName?: string;
  //   status?: 'ACTIVE' | 'INACTIVE';
  // }) {
  //   try {
  //     const options = {
  //       take: params.size,
  //       skip: (params.page - 1) * params.size,
  //       // orderBy: { last_modified_ts: 'desc' },
  //       include: { category: true },
  //       where: {
  //         category: {
  //           name: params.categoryName ?? undefined,
  //         },
  //         status: params.status ?? undefined,
  //       },
  //     };
  //     const { include: _include, ...countOption } = options;
  //     const data = await this.prismaService.news.findMany(options);
  //     const count = await this.prismaService.news.count(countOption);
  //     return {
  //       data: data,
  //       count: count,
  //     };
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

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

  async searchAll(params: {
    page: number;
    size: number;
    categoryName?: string;
  }) {
    try {
      const currentUser = JSON.parse(
        this.request.headers.data as string,
      ) as LoginedUser;
      const userType = currentUser['additional-data'].userType;
      const options: Prisma.newsFindManyArgs = {
        take: params.size,
        skip: (params.page - 1) * params.size,
        include: { category: true },
        where: {
          category: {
            name: params.categoryName ?? undefined,
          },
          OR: !(userType === 'ADMIN') ? [
            {
              users: {
                some: { id: currentUser['additional-data'].id },
              }
            },
            {
              agentViewRule: ['AGENT', "SUBAGENT"].includes(userType) ? 'ALL' : undefined
            },
            {
              caViewRule: ['CA', "SUBCA"].includes(userType) ? 'ALL' : undefined
            },
            {
              gsaViewRule: userType === 'GSA' ? 'ALL' : undefined
            },
          ] : undefined,
          status: 'ACTIVE',
        },
      }
      const { include, ...countOptions } = options
      const data = await this.prismaService.news.findMany(options);
      //@ts-ignore
      const count = await this.prismaService.news.count(countOptions);
      return {
        data: data,
        count: count,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  searchByTitle(title: string) {
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
      const currentUser = JSON.parse(
        this.request.headers.data as string,
      ) as LoginedUser;
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
          last_modified_by: currentUser['additional-data'].username,
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
