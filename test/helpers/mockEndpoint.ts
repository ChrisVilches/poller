import { EndpointDto } from '@persistence/dto/endpoint.dto';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Method } from '@persistence/enum/method.enum';
import { RequestType } from '@persistence/enum/request-type.enum';
import { transformAndValidate } from 'class-transformer-validator';
import { convertArgs } from './convertArgs';
import { convertNav } from './convertNav';

export const mockEndpoint = (props: object = {}) => {
  const result = {
    title: 'endpoint mock',
    url: 'https://www.some-url.com',
    notificationMessage: 'my message',
    type: RequestType.HTML,
    rule: 'HasOccurrencesRule',
    periodMinutes: 15,
    waitAfterNotificationMinutes: 120,
    navigations: [],
    arguments: [],
    not: false,
    method: Method.GET,
    ...props,
  };

  if (result.navigations) {
    result.navigations = convertNav(result.navigations) as any;
  }

  if (result.arguments) {
    result.arguments = convertArgs(result.arguments) as any;
  }

  return result;
};

export const mockEndpointInstance = async (props: object = {}) => {
  const endpointPlain = mockEndpoint(props);
  return (await transformAndValidate(EndpointDto, endpointPlain)) as Endpoint;
};
