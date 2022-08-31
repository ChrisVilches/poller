import { EndpointDto } from '@persistence/dto/endpoint.dto';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { validateAndTransform } from '../../src/util';

export const mockEndpoint = (props: object = {}) => ({
  title: 'endpoint mock',
  url: 'https://www.some-url.com',
  notificationMessage: 'my message',
  type: 'html',
  rule: 'WhenHasTextRaw',
  periodMinutes: 15,
  waitAfterNotificationMinutes: 10,
  navigations: [],
  arguments: [],
  not: false,
  ...props,
});

export const mockEndpointInstance = async (props: object = {}) => {
  const endpointPlain = mockEndpoint(props);
  return (await validateAndTransform(EndpointDto, endpointPlain)) as Endpoint;
};
