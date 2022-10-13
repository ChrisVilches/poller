import { CheerioAPI } from 'cheerio';
import { replaceTokens } from '@util/strings';
import { Rule } from './Rule';

export class AlwaysRule implements Rule {
  private latestContent = '';

  execute(_args: (string | number | boolean)[]) {
    return (dom: CheerioAPI) => {
      const html: string = dom.text();

      this.latestContent = html;

      return true;
    };
  }

  messageFromLatestResult(inputMessage?: string): string | undefined {
    if (inputMessage === null || typeof inputMessage === 'undefined') {
      return undefined;
    }

    return replaceTokens(inputMessage, {
      content: this.latestContent,
    });
  }

  validate(args: any[]): boolean {
    return args.length === 0;
  }
}
