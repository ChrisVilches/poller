import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';

// TODO: Similar to the "endpointDtoToEntity" method, this one also creates an
//       object without a clearly defined structure (since it can have tags or not),
//       I think I can work both methods together (endpointDtoToEntity and this one) and come up
//       with a solution that works well for both. Also both are used as the final step as input
//       for the database (create, update, etc), so they are similar in that regard as well.
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
