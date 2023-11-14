import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Version
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Permissions } from 'src/roles/role.decorator';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @Permissions(['R_NEWS_UPDATE'])
  @Version('1')
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Permissions(['R_NEWS_VIEW'])
  @Get("/searchAll")
  @Version('1')
  searchAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('categoryName') categoryName: string,
  ) {
    const params = {
      page: page || 1,
      size: size || 10,
      categoryName: categoryName,
    };
    return this.newsService.searchAll(params);
  }

  @Permissions(['R_NEWS_VIEW'])
  @Get('/findById/:id')
  @Version('1')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.newsService.findOne(id);
  }


  @Permissions(['R_NEWS_VIEW'])
  @Get('/findByTitle/:title')
  @Version('1')
  find(@Param('title') title: string) {
    return this.newsService.searchByTitle(title);
  }

  @Patch(':id')
  @Permissions(['R_NEWS_UPDATE'])
  @Version('1')
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: Partial<Prisma.newsCreateInput>,
  ) {
    return this.newsService.update(id, updateNewsDto);
  }

}
