import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto, @Req() req: Request) {
    const currentUser = JSON.parse(req.headers.data as string);
    return this.newsService.create(createNewsDto, currentUser);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('categoryName') categoryName: string,
    @Req() req: Request,
  ) {
    const params = {
      page: page || 1,
      size: size || 10,
      categoryName: categoryName,
    };
    const currentUser = JSON.parse(req.headers.data as string);
    return this.newsService.findAll(params, currentUser);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.newsService.findOne(id);
  }

  @Get(':title')
  find(@Param('title') title: string) {
    return this.newsService.findByTitle(title);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: Partial<Prisma.newsCreateInput>,
  ) {
    return this.newsService.update(id, updateNewsDto);
  }
}
