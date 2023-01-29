import { EndpointCreateDto } from '@api/dto/endpoint-create.dto';
import { EndpointUpdateDto } from '@api/dto/endpoint-update.dto';
import { PollingDto } from '@persistence/dto/polling.dto';

export const mockEndpointDto = (
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

export const mockPollingDto = (args: any = {}) => {
  const res = new PollingDto();
  res.endpointId = 1;
  res.manual = true;
  res.shouldNotify = false;
  res.responseCode = 200;
  res.shouldNotify = false;
  res.computedMessage = 'message';
  Object.assign(res, args);
  return res;
};
