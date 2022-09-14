import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';
import { EndpointDto } from '@persistence/dto/endpoint.dto';
import { Method } from '@persistence/enum/method.enum';
import { RequestType } from '@persistence/enum/request-type.enum';
import { plainToInstance } from 'class-transformer';

const convertMethod = (method = ''): Method => {
  const map = {
    GET: Method.GET,
    POST: Method.POST,
    PUT: Method.PUT,
    PATCH: Method.PATCH,
    DELETE: Method.DELETE,
  };

  const result = map[method.toUpperCase() as keyof typeof map];

  if (typeof result === 'undefined') {
    return Method.INVALID;
  }

  return result;
};

const convertType = (type = ''): RequestType => {
  if (type.toLowerCase() === 'html') {
    return RequestType.HTML;
  } else if (type.toLowerCase() === 'dhtml') {
    return RequestType.DHTML;
  } else if (type.toLowerCase() === 'json') {
    return RequestType.JSON;
  }

  return RequestType.INVALID;
};

export const convertNav = (nav: string[]) =>
  nav.map((selector: string) => ({ selector }));

export const convertArgs = (args: any[]) =>
  args.map((value: any) => ({ value }));

/**
 * @param input Endpoint object in the same format that's required by the API.
 * @returns {EndpointDto} Object converted to `EndpointDto`.
 */
export const convertEndpointDto = (
  input: EndpointCreateDto | EndpointUpdateDto,
): EndpointDto => {
  const plain: any = { ...input };

  if (input.type) {
    plain.type = convertType(input.type);
  }
  if (input.method) {
    plain.method = convertMethod(input.method);
  }
  if (input.navigations) {
    plain.navigations = convertNav(input.navigations);
  }
  if (input.arguments) {
    plain.arguments = convertArgs(input.arguments);
  }
  if ((input as EndpointUpdateDto).tags) {
    plain.tags = (input as EndpointUpdateDto).tags?.map((id: number) => ({
      id,
    }));
  }

  return plainToInstance(EndpointDto, plain);
};
