import { EndpointDto } from '@persistence/dto/endpoint.dto';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { validateAndTransform } from '../../src/util';
import { convertArgs } from './convertArgs';
import { convertNav } from './convertNav';

export const mockEndpoint = (props: object = {}) => {
  const result = {
    title: 'endpoint mock',
    url: 'https://www.some-url.com',
    notificationMessage: 'my message',
    type: 'html',
    rule: 'WhenHasTextRaw',
    periodMinutes: 15,
    waitAfterNotificationMinutes: 120,
    navigations: [],
    arguments: [],
    not: false,
    staticHtml: true,
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
  return (await validateAndTransform(EndpointDto, endpointPlain)) as Endpoint;
};
