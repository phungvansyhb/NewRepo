import { Module } from '@nestjs/common';
import { NewsCategoryService } from './news-category.service';
import { NewsCategoryController } from './news-category.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [NewsCategoryController],
  providers: [NewsCategoryService, PrismaService, LoggerService],
})
export class NewsCategoryModule {}
