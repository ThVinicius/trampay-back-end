import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
