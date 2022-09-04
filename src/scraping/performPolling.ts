import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import { allRules } from '@rules/allRules';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { getDynamicHTML } from './getDynamicHTML';
import { Rule } from '@rules/Rule';
import { inspectArray, navigate } from '@util/misc';
import { PollingDto } from '@persistence/dto/polling.dto';
import { RequestType } from '@persistence/enum/request-type.enum';
import { RequestResult } from '@interfaces/RequestResult';

interface PollingResult {
  shouldNotify: boolean;
  status: number;
  computedMessage?: string;
}

const request = async (endpoint: Endpoint): Promise<RequestResult> => {
  const aux = async () => {
    switch (endpoint.type) {
      case RequestType.HTML:
        return await axios.request({
          url: endpoint.url,
          method: endpoint.methodLowerCase(),
        });
      case RequestType.DHTML:
        return await getDynamicHTML(endpoint.url);
      default:
        throw new Error('JSON not supported yet');
    }
  };

  const { data, status } = await aux();
  return { data, status };
};

/**
 * @throws {Error}
 */
const ensureNavigate = (html: CheerioAPI, navigation: string[]) => {
  try {
    return navigate(html, navigation);
  } catch (e) {
    throw new Error(`Incorrect navigations: [${navigation.join(', ')}]`);
  }
};

/**
 * @throws {Error}
 */
const ensureRule = (rule: string, args: any[]) => {
  const ruleInstance: Rule = new (allRules as any)[rule]();

  if (!ruleInstance.validate(args)) {
    throw new Error(`Invalid arguments: [${inspectArray(args)}]`);
  }

  return ruleInstance;
};

const performPollingAux = async (
  endpoint: Endpoint,
): Promise<PollingResult> => {
  const { rule, not = false } = endpoint;

  const ruleInstance: Rule = ensureRule(rule, endpoint.args());

  const ruleFunction = ruleInstance.execute.call(ruleInstance, endpoint.args());

  const { data, status } = await request(endpoint);

  const htmlResult = load(data);
  const domElement = ensureNavigate(htmlResult, endpoint.navigation());
  const shouldNotify = ruleFunction(domElement);

  return {
    shouldNotify: not ? !shouldNotify : shouldNotify,
    status,
    computedMessage: ruleInstance.messageFromLatestResult(
      endpoint.notificationMessage,
    ),
  };
};

export const performPolling = async (
  endpoint: Endpoint,
  manual: boolean,
): Promise<PollingDto> => {
  const polling = new PollingDto();
  polling.endpointId = endpoint.id;
  polling.manual = manual;
  polling.shouldNotify = false;

  try {
    const { status, shouldNotify, computedMessage } = await performPollingAux(
      endpoint,
    );
    polling.responseCode = status;
    polling.shouldNotify = shouldNotify;
    polling.computedMessage = computedMessage;
    return polling;
  } catch (e) {
    polling.error = e.message;
    return polling;
  }
};
