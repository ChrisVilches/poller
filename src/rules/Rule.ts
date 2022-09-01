import { CheerioAPI } from 'cheerio';

export interface Rule {
  execute(args: (string | number | boolean)[]): (dom: CheerioAPI) => boolean;

  validate(args: any[]): boolean;

  /**
   * Builds the notification message using the original message (possibly containing
   * tokens), and the latest result that was obtained using this instance.
   */
  messageFromLatestResult(inputMessage?: string): string | undefined;
}
