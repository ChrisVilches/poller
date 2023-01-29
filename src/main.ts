import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configureApp } from './configureApp';
import { DelayInterceptor } from '@api/interceptors/delay.interceptor';
import { isProd } from '@util/env';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('combined'));

  configureApp(app);

  const appName = 'Poller';

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`The ${appName} API description`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if (!isProd()) {
    app.enableCors();
    app.useGlobalInterceptors(new DelayInterceptor());
  }

  await app.listen(Number(process.env.PORT));
}
bootstrap();
