import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configureApp } from './configureApp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const appName = 'Poller';

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`The ${appName} API description`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // TODO: Try to find a better (more strict) configuration.
  //       This is necessary to use the React application.
  app.enableCors();
  await app.listen(Number(process.env.PORT));
}
bootstrap();
