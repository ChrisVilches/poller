import axios from 'axios';
import cheerio from 'cheerio';
import { allRules } from '@rules/allRules';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { getDynamicHTML } from './getDynamicHTML';
import { Rule } from '@rules/Rule';
import { inspectArray, navigate } from '@util/misc';

interface PollingResult {
  shouldNotify: boolean;
  status: number;
  computedMessage?: string;
}

export const performPolling = async (
  endpoint: Endpoint,
): Promise<PollingResult> => {
  const { url, rule, not = false } = endpoint;

  const args = endpoint.args();

  const ruleInstance: Rule = new (allRules as any)[rule]();

  if (!ruleInstance.validate(args)) {
    throw new Error(`Invalid arguments: [${inspectArray(args)}]`);
  }

  const ruleFunction = ruleInstance.execute.call(ruleInstance, args);

  let data: string, status: number;

  if (endpoint.staticHtml) {
    const res = await axios.get(url);
    data = res.data;
    status = res.status;
  } else {
    const res = await getDynamicHTML(url);
    data = res.data;
    status = res.status;
  }

  const htmlResult = cheerio.load(data);
  let domElement;

  try {
    domElement = navigate(htmlResult, endpoint.navigation());
  } catch (e) {
    throw new Error(
      `Incorrect navigations: [${endpoint.navigation().join(', ')}]`,
    );
  }
  const shouldNotify = ruleFunction(domElement);

  return {
    shouldNotify: not ? !shouldNotify : shouldNotify,
    status,
    computedMessage: ruleInstance.messageFromLatestResult(
      endpoint.notificationMessage,
    ),
  };
};
