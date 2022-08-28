import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT!);

  // TODO: Code below is probably trash

  const server = app.getHttpServer();
  const router = server._events.request._router;

  const availableRoutes: [] = router.stack
    .map((layer: { route: { path: any; stack: { method: any }[] } }) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item: undefined) => item !== undefined);
  console.log(availableRoutes);
}
bootstrap();
