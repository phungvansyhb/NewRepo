import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewCategoryModule } from './new-category/new-category.module';
import { NewsCategoryModule } from './news-category/news-category.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [NewCategoryModule, NewsCategoryModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
