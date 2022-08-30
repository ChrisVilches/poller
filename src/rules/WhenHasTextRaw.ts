import { CheerioAPI } from 'cheerio';
import {
  isValidComparisonOperator,
  comparisonOperator,
  ComparisonOperator,
} from '../util';
import { Rule } from './Rule';

export class WhenHasTextRaw implements Rule {
  execute(text: string, times: number, op: ComparisonOperator = '==') {
    return (dom: CheerioAPI) => {
      const html = dom.text();
      const regex = new RegExp(text, 'gi');
      const count = (html.match(regex) || []).length;
      return comparisonOperator(op, count, times);
    };
  }

  validate(args: any[]) {
    if (![2, 3].includes(args.length)) return false;

    const [text, times, op = '=='] = args;

    if (!isValidComparisonOperator(op)) return false;
    if (typeof text !== 'string') return false;
    if (text.length === 0) return false;

    return times >= 0;
  }
}
