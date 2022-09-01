import { CheerioAPI } from 'cheerio';
import {
  replaceTokens,
} from '../util';
import { Rule } from './Rule';

export class ContentEquals implements Rule {
  private latestMatch: string = '';

  execute(args: (string | number | boolean)[]) {
    const [text] = args;

    return this.executeAux(
      text as string
    );
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
      console.log(html)

      if (html.toLowerCase() === text.toLocaleLowerCase()) {
        this.latestMatch = text
        return true
      }

      this.latestMatch = html
      return false
    };
  }

  validate(args: any[]): boolean {
    if (args.length !== 1) return false;
    return typeof args[0] === 'string'
  }
}
