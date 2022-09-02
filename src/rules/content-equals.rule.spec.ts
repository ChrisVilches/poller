import { load } from 'cheerio';
import { ContentEqualsRule } from './content-equals.rule';

describe(ContentEqualsRule.name, () => {
  const rule = new ContentEqualsRule();

  describe('validate', () => {
    it('should validate correct arguments', () => {
      expect(rule.validate(['hello'])).toBe(true);
      expect(rule.validate([''])).toBe(true);
    });

    it('should invalidate wrong arguments', () => {
      expect(rule.validate([undefined, 2])).toBe(false);
      expect(rule.validate(['x', 2])).toBe(false);
      expect(rule.validate([true, 'x'])).toBe(false);
      expect(rule.validate([])).toBe(false);
    });
  });

  describe('execute', () => {
    it('checks the content is equal', () => {
      const html = 'hello';

      expect(rule.execute(['hello'])(load(html))).toBe(true);
      expect(rule.execute(['world'])(load(html))).toBe(false);
      expect(rule.execute([''])(load(html))).toBe(false);
    });

    it('is case-insensitive', () => {
      const html = 'hello';

      expect(rule.execute(['hello'])(load(html))).toBe(true);
      expect(rule.execute(['hEllo'])(load(html))).toBe(true);
    });

    it('ignores html tags', () => {
      const html = '<div><p>hello</p></div>';

      expect(rule.execute(['hello'])(load(html))).toBe(true);
    });

    it('trims the text using cheerio specifications', () => {
      expect(rule.execute(['hello'])(load(' hello '))).toBe(false);
      expect(rule.execute(['hello '])(load(' hello '))).toBe(true);
      expect(rule.execute(['hello'])(load('<p> hello  </p>'))).toBe(false);
      expect(rule.execute([' hello  '])(load('<p> hello  </p>'))).toBe(true);
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
