import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/logger/logger.service';
import { ContextService } from 'src/auth/context.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, PrismaService, LoggerService, ContextService],
})
export class NewsModule {}
