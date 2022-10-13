import { load } from 'cheerio';
import { AlwaysRule } from './always.rule';

describe(AlwaysRule.name, () => {
  const rule = new AlwaysRule();

  describe('validate', () => {
    it('should validate correct arguments', () => {
      expect(rule.validate([])).toBe(true);
    });

    it('should invalidate wrong arguments', () => {
      expect(rule.validate([undefined, 2])).toBe(false);
      expect(rule.validate(['x', 2])).toBe(false);
      expect(rule.validate([1])).toBe(false);
      expect(rule.validate([true, 'x'])).toBe(false);
      expect(rule.validate([''])).toBe(false);
    });
  });

  describe('execute', () => {
    it('is always true', () => {
      expect(rule.execute([])(load('<p>hello</p>'))).toBe(true);
      expect(rule.execute([])(load(''))).toBe(true);
    });
  });

  describe('messageFromLatestResult', () => {
    it('builds message based on the actual content', () => {
      const html = '<div>  the content </div>';
      rule.execute(['hello'])(load(html));
      expect(
        rule.messageFromLatestResult('content changed, it is: %content%'),
      ).toBe('content changed, it is:   the content ');
    });
  });
});
