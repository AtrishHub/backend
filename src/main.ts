import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Chatbot API')
    .setDescription('The official API documentation for my project')
    .setVersion('1.0')
    .addTag('cats', 'Endpoints related to cats') // You can add tags to group endpoints
    .addBearerAuth() // If you use JWT Bearer authentication
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
