import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './roles/role.guard';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  const config = new DocumentBuilder()
    .setTitle('VNA news example')
    .setDescription('The news API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.info('Server start at port 3001 , --- happy coding ---');
  console.info('project path,', __dirname);
  await app.listen(3001);
}

bootstrap();
