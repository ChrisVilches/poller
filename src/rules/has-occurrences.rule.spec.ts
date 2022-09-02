import { load } from 'cheerio';
import { HasOccurrencesRule } from './has-occurrences.rule';

describe(HasOccurrencesRule.name, () => {
  const rule = new HasOccurrencesRule();

  describe('validate', () => {
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
  });

  describe('execute', () => {
    it('should count occurrences', () => {
      const html = `
      <div>
        <span>hello></span>
        <span>hello my name is></span>
      </div>`;

      expect(rule.execute(['hello', 2, '=='])(load(html))).toBe(true);
      expect(rule.execute(['ell', 2, '=='])(load(html))).toBe(true);
      expect(rule.execute(['hello', 2, '>='])(load(html))).toBe(true);
      expect(rule.execute(['hello', 1, '>'])(load(html))).toBe(true);
      expect(rule.execute(['hello', 2, '>'])(load(html))).toBe(false);
    });

    it('should count occurrences case-insensitive', () => {
      const html = `
      <div>
        <span>HeLLo></span>
        <span>hELLO my name is></span>
      </div>`;

      expect(rule.execute(['hello', 2, '=='])(load(html))).toBe(true);
      expect(rule.execute(['ell', 2, '=='])(load(html))).toBe(true);
      expect(rule.execute(['hello', 2, '>='])(load(html))).toBe(true);
      expect(rule.execute(['hello', 1, '>'])(load(html))).toBe(true);
      expect(rule.execute(['hello', 2, '>'])(load(html))).toBe(false);
    });
  });

  describe('messageFromLatestResult', () => {
    it('builds message based on the occurrences', () => {
      const html = `
      <div>
        <span>HeLLo></span>
        <span>hELLO my name is></span>
      </div>`;
      rule.execute(['hello', 1])(load(html));
      expect(rule.messageFromLatestResult('my count is %count%, bye')).toBe(
        'my count is 2, bye',
      );
    });
  });
});
