import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';

// TODO: What's the difference between | and & ??? which one should I use here??

export const mockEndpoint = (
  props: EndpointCreateDto | EndpointUpdateDto = {},
): EndpointCreateDto | EndpointUpdateDto => {
  return {
    title: 'endpoint mock',
    url: 'https://www.some-url.com',
    notificationMessage: 'my message',
    type: 'HTML',
    rule: 'HasOccurrencesRule',
    periodMinutes: 15,
    waitAfterNotificationMinutes: 120,
    navigations: [],
    arguments: [],
    not: false,
    method: 'GET',
    ...props,
  };
};
