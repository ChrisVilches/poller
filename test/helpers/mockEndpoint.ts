import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';
import { EndpointDto } from '@persistence/dto/endpoint.dto';
import { convertEndpointDto } from '@util/endpoints';

/**
 * Creates a valid dummy object.
 *
 * Missing attributes are assigned a dummy value. The object will still be valid even if
 * the argument is empty.
 *
 * @param props Endpoint partial object in the same format that's required by the API.
 * @returns {EndpointDto} Object converted to `EndpointDto`.
 */
export const mockEndpoint = (
  props: EndpointCreateDto | EndpointUpdateDto = {},
): EndpointDto => {
  const result: EndpointCreateDto | EndpointUpdateDto = {
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

  return convertEndpointDto(result);
};
