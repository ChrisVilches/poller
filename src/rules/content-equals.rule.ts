import { CheerioAPI } from 'cheerio';
import { replaceTokens } from '@util/strings';
import { Rule } from './Rule';

export class ContentEqualsRule implements Rule {
  private latestMatch = '';

  execute(args: (string | number | boolean)[]) {
    const [text] = args;

    return this.executeAux(text as string);
  }

  messageFromLatestResult(inputMessage?: string): string | undefined {
    if (inputMessage === null || typeof inputMessage === 'undefined') {
      return undefined;
    }

    return replaceTokens(inputMessage, {
      content: this.latestMatch,
    });
  }

  private executeAux(text: string) {
    return (dom: CheerioAPI) => {
      const html: string = dom.text();

      this.latestMatch = html;

      return html.toLowerCase() === text.toLowerCase();
    };
  }

  validate(args: any[]): boolean {
    if (args.length !== 1) return false;
    return typeof args[0] === 'string';
  }
}
