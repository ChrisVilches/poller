import { INestApplication } from '@nestjs/common';
import { runApp } from './runner';

runApp(async (app: INestApplication) => {
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

  const routes = availableRoutes.map((obj: any) => obj.route);

  const length =
    2 + routes.reduce((accum, elem) => Math.max(accum, elem.method.length), 0);

  routes.sort((a, b) => a.path.localeCompare(b.path));

  for (const { path, method } of routes) {
    let formattedMethod = method.toUpperCase();
    while (formattedMethod.length < length) {
      formattedMethod += ' ';
    }
    console.log(`${formattedMethod} ${path}`);
  }
});
