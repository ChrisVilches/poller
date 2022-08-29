// import { CheerioAPI } from "cheerio";

export interface Rule {
  // TODO: How can I add the "execute" method with variable arguments?
  // execute(...args: any[]): ((dom: CheerioAPI) => boolean);
  validate(args: any[]): void;
}
