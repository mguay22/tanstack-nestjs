import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation with Zod
  app.useGlobalPipes(new ZodValidationPipe());

  // Configure Swagger - nestjs-zod DTOs automatically integrate with Swagger
  const config = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('Tasks API with Zod validation and type-safe DTOs')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: 'http://localhost:3000' });
  await app.listen(process.env.PORT ?? 3001);

  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3001}/api`);
}
bootstrap();
