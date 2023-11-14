import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware } from 'auth.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsCategoryModule } from './news-category/news-category.module';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UploadModule } from './upload/upload.module';
import helmet from 'helmet';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    NewsCategoryModule,
    NewsModule,
    PrismaModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../dist/assets/files'),
      renderPath: '/dist/assets/files'
    }),
    MulterModule.register({
      dest: '/dist/assets/files',
    })],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(helmet(), AuthMiddleware)
      .forRoutes({ path: '/v1/*', method: RequestMethod.ALL });
  }
}
