import { CheerioAPI } from 'cheerio';
import {
  isValidComparisonOperator,
  comparisonOperator,
  ComparisonOperator,
  replaceTokens,
} from '../util';
import { Rule } from './Rule';

export class HasOccurrencesRule implements Rule {
  private latestCount = 0;

  execute(args: (string | number | boolean)[]) {
    const [text, times, op = '=='] = args;

    return this.executeAux(
      text as string,
      times as number,
      op as ComparisonOperator,
    );
  }

  messageFromLatestResult(inputMessage?: string): string | undefined {
    if (inputMessage === null || typeof inputMessage === 'undefined') {
      return undefined;
    }

    return replaceTokens(inputMessage, {
      count: this.latestCount,
    });
  }

  private executeAux(
    text: string,
    times: number,
    op: ComparisonOperator = '==',
  ) {
    return (dom: CheerioAPI) => {
      const html = dom.text();
      const regex = new RegExp(text, 'gi');
      const count = (html.match(regex) || []).length;

      this.latestCount = count;

      return comparisonOperator(op, count, times);
    };
  }

  validate(args: any[]): boolean {
    if (![2, 3].includes(args.length)) return false;

    const [text, times, op = '=='] = args;

    if (!isValidComparisonOperator(op)) return false;
    if (typeof text !== 'string') return false;
    if (text.length === 0) return false;

    return times >= 0;
  }
}
