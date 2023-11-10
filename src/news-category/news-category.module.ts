import { Module } from '@nestjs/common';
import { NewsCategoryService } from './news-category.service';
import { NewsCategoryController } from './news-category.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/logger/logger.service';
import { ContextService } from 'src/auth/context.service';

@Module({
  controllers: [NewsCategoryController],
  providers: [
    NewsCategoryService,
    PrismaService,
    LoggerService,
    ContextService,
  ],
})
export class NewsCategoryModule {}
