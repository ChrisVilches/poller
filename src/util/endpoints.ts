import { Argument } from '@persistence/entities/argument.entity';
import { Navigation } from '@persistence/entities/navigation.entity';
import { Method } from '@persistence/enum/method.enum';
import { RequestType } from '@persistence/enum/request-type.enum';

export const convertMethod = (method: string): Method => {
  const map = {
    GET: Method.GET,
    POST: Method.POST,
    PUT: Method.PUT,
    PATCH: Method.PATCH,
    DELETE: Method.DELETE,
  };

  return map[method.toUpperCase() as keyof typeof map];
};

export const convertType = (type: string): RequestType => {
  const map = {
    HTML: RequestType.HTML,
    DHTML: RequestType.DHTML,
    JSON: RequestType.JSON,
  };

  return map[type.toUpperCase() as keyof typeof map];
};

export const convertNav = (nav: string[]): Navigation[] =>
  nav.map((selector: string) => {
    const nav = new Navigation();
    nav.selector = selector;
    return nav;
  });

export const convertArgs = (args: any[]): Argument[] =>
  args.map(Argument.fromValue);
