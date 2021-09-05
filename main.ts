import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Adding global exception handler
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
