import { INestApplication } from '@nestjs/common';
import { runApp } from './runner';

runApp(async (app: INestApplication) => {
  const server = app.getHttpServer();
  const router = server._events.request._router;

  const availableRoutes: [] = router.stack
    .map((layer: { route: { path: any; stack: { method: any; }[]; }; }) => {
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
  console.log(availableRoutes.map((obj: any) => obj.route));
})
