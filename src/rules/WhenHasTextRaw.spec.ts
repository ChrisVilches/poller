import cheerio from 'cheerio';
import { WhenHasTextRaw } from './WhenHasTextRaw';

describe(WhenHasTextRaw.name, () => {
  const rule = new WhenHasTextRaw();

  it('should validate correct arguments', () => {
    expect(rule.validate(['hello', 2])).toBe(true);
    expect(rule.validate(['hello', 2, '=='])).toBe(true);
    expect(rule.validate(['hello', 2, '>='])).toBe(true);
    expect(rule.validate(['hello', 2, '<='])).toBe(true);
    expect(rule.validate(['hello', 0])).toBe(true);
  });

  it('should invalidate wrong arguments', () => {
    expect(rule.validate([undefined, 2])).toBe(false);
    expect(rule.validate(['hello', 2, '==', '...'])).toBe(false);
    expect(rule.validate([6, 2, '>='])).toBe(false);
    expect(rule.validate([true, 2, '<='])).toBe(false);
    expect(rule.validate(['hello', 2, '==='])).toBe(false);
    expect(rule.validate(['hello', -1])).toBe(false);
  });

  it('should count occurrences', () => {
    const html = `
    <div>
      <span>hello></span>
      <span>hello my name is></span>
    </div>`;

    expect(rule.execute('hello', 2, '==')(cheerio.load(html))).toBe(true);
    expect(rule.execute('ell', 2, '==')(cheerio.load(html))).toBe(true);
    expect(rule.execute('hello', 2, '>=')(cheerio.load(html))).toBe(true);
    expect(rule.execute('hello', 1, '>')(cheerio.load(html))).toBe(true);
    expect(rule.execute('hello', 2, '>')(cheerio.load(html))).toBe(false);
  });

  it('should count occurrences case-insensitive', () => {
    const html = `
    <div>
      <span>HeLLo></span>
      <span>hELLO my name is></span>
    </div>`;

    expect(rule.execute('hello', 2, '==')(cheerio.load(html))).toBe(true);
    expect(rule.execute('ell', 2, '==')(cheerio.load(html))).toBe(true);
    expect(rule.execute('hello', 2, '>=')(cheerio.load(html))).toBe(true);
    expect(rule.execute('hello', 1, '>')(cheerio.load(html))).toBe(true);
    expect(rule.execute('hello', 2, '>')(cheerio.load(html))).toBe(false);
  });
});
