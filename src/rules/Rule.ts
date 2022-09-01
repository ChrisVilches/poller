import { CheerioAPI } from 'cheerio';

export interface Rule {
  execute(args: (string | number | boolean)[]): (dom: CheerioAPI) => boolean;

  validate(args: any[]): boolean;

  messageFromLatestResult(inputMessage?: string): string | undefined;
}
