export const mockEndpoint = (props: object = {}) => ({
  title: 'endpoint mock',
  url: 'https://www.some-url.com',
  notificationMessage: 'my message',
  type: 'html',
  rule: 'WhenHasTextRaw',
  periodMinutes: 15,
  not: false,
  ...props,
});
