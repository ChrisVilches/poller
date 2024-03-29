import { Method } from '@persistence/enum/method.enum';
import { load } from 'cheerio';
import { isDev, isProd, isTest } from './env';
import { enumKeysToString, inspectArray, isArrayOf, navigate } from './misc';
import { comparisonOperator, ComparisonOperator } from './operators';
import {
  removeUrlQueryString,
  replaceTokens,
  limitMessageLength,
} from './strings';

describe(comparisonOperator.name, () => {
  it('should compare correctly using ==', () => {
    expect(comparisonOperator('==', 1, 1)).toBe(true);
    expect(comparisonOperator('==', 1, 2)).toBe(false);
  });

  it('should compare correctly using >=', () => {
    expect(comparisonOperator('>=', 1, 1)).toBe(true);
    expect(comparisonOperator('>=', 3, 2)).toBe(true);
    expect(comparisonOperator('>=', 3, 6)).toBe(false);
  });

  it('should compare correctly using <=', () => {
    expect(comparisonOperator('<=', 1, 1)).toBe(true);
    expect(comparisonOperator('<=', 3, 2)).toBe(false);
    expect(comparisonOperator('<=', 3, 6)).toBe(true);
  });

  it('should compare correctly using >', () => {
    expect(comparisonOperator('>', 1, 1)).toBe(false);
    expect(comparisonOperator('>', 3, 2)).toBe(true);
    expect(comparisonOperator('>', 3, 6)).toBe(false);
  });

  it('should compare correctly using <', () => {
    expect(comparisonOperator('<', 1, 1)).toBe(false);
    expect(comparisonOperator('<', 3, 2)).toBe(false);
    expect(comparisonOperator('<', 3, 6)).toBe(true);
  });

  it('should validate the operator', () => {
    expect(() =>
      comparisonOperator('<<' as ComparisonOperator, 1, 1),
    ).toThrow();
    expect(() =>
      comparisonOperator('< ' as ComparisonOperator, 1, 1),
    ).toThrow();
    expect(() =>
      comparisonOperator('>>' as ComparisonOperator, 1, 1),
    ).toThrow();
    expect(() =>
      comparisonOperator('===' as ComparisonOperator, 1, 1),
    ).toThrow();
    expect(() => comparisonOperator('' as ComparisonOperator, 1, 1)).toThrow();
    expect(() => comparisonOperator(undefined as any, 1, 1)).toThrow();
    expect(() => comparisonOperator(null as any, 1, 1)).toThrow();
    expect(() => comparisonOperator(true as any, 1, 1)).toThrow();
  });
});

describe(inspectArray.name, () => {
  it('should convert the string correctly with multiple elements', () => {
    const result =
      'aa (string), bb (string), true (boolean), 3 (number), cc (string)';
    expect(inspectArray(['aa', 'bb', true, 3, 'cc'])).toBe(result);
  });

  it('should convert the string correctly with one element', () => {
    expect(inspectArray(['aa'])).toBe('aa (string)');
  });

  it('should convert the string correctly with no elements', () => {
    expect(inspectArray([])).toBe('');
  });
});

describe(removeUrlQueryString.name, () => {
  it('removes it correctly', () => {
    expect(removeUrlQueryString('aaaa?aa')).toBe('aaaa');
    expect(removeUrlQueryString('www.google.com?a=2&b=6')).toBe(
      'www.google.com',
    );
    expect(removeUrlQueryString('www.google.com?')).toBe('www.google.com');
    expect(removeUrlQueryString('www.google.com/some/path?a')).toBe(
      'www.google.com/some/path',
    );
    expect(removeUrlQueryString('www.google.com/some/path?a=1&b=2')).toBe(
      'www.google.com/some/path',
    );
    expect(removeUrlQueryString('www.google.com')).toBe('www.google.com');
    expect(removeUrlQueryString('www.google.com????')).toBe('www.google.com');
    expect(removeUrlQueryString('www.google.com?a=5?b=1?c=1?')).toBe(
      'www.google.com',
    );
    expect(removeUrlQueryString('')).toBe('');
    expect(removeUrlQueryString('?')).toBe('');
    expect(removeUrlQueryString('1')).toBe('1');
  });
});

describe(replaceTokens.name, () => {
  it('replaces it correctly', () => {
    expect(replaceTokens('The count is %count%', { count: 84 })).toBe(
      'The count is 84',
    );
  });

  it('replaces it correctly when it is repeated', () => {
    expect(
      replaceTokens('The count is %count%, and %count%', { count: 14 }),
    ).toBe('The count is 14, and 14');
  });

  it('replaces multiple tokens', () => {
    expect(
      replaceTokens('My name is %name% and my age is %age%', {
        name: ' John  ',
        age: 100,
      }),
    ).toBe('My name is  John   and my age is 100');
  });

  it('ignores tokens that are not present', () => {
    expect(
      replaceTokens('The count is %count%, and %hello% world', { count: 17 }),
    ).toBe('The count is 17, and %hello% world');
  });

  it('ignores tokens that have a typo (extra space)', () => {
    expect(replaceTokens('The number is % number%', { number: 1000 })).toBe(
      'The number is % number%',
    );
  });

  it('returns the original string if there are no tokens', () => {
    expect(replaceTokens('hello world', { count: 24 })).toBe('hello world');
  });

  it('handles empty string correctly', () => {
    expect(replaceTokens('', { count: 124 })).toBe('');
  });

  it('converts the string if the string is wrong (converts only the parts with correct format)', () => {
    expect(
      replaceTokens('some %count%%name%%%m%AA%% count%', {
        count: 15,
        name: ' the_name ',
      }),
    ).toBe('some 15 the_name %%m%AA%% count%');
  });

  it('replaces the token even if there are non-space characters around it', () => {
    expect(replaceTokens('here is the%count%token', { count: 2000 })).toBe(
      'here is the2000token',
    );
  });

  it('replaces booleans correctly', () => {
    expect(
      replaceTokens('should it notify: (%should%)', { should: true }),
    ).toBe('should it notify: (true)');
    expect(
      replaceTokens('should it notify: (%should%)', { should: false }),
    ).toBe('should it notify: (false)');
  });

  it('is case sensitive', () => {
    expect(
      replaceTokens('should it notify: (%Should%)', { should: true }),
    ).toBe('should it notify: (%Should%)');
  });
});

describe(navigate.name, () => {
  const htmlNestedIds = `
    <div>
      <div id='first'>
        Hello
      </div>
      <div id='second'>
        How are you
        <div id='third'>
          Bye bye
        </div>
      </div>
    </div>
  `;

  const htmlTable = `
    <table>
      <tr>
        <td>
          <span>text inside span</span>
          <span>another text</span>
          <div>
            Inside a div
            <a>link one</a>
            <a>link two</a>
          </div>
        </td>
        <td>Some cell</td>
      </tr>
      <tr>
        <td>cell A</td>
        <td>cell B</td>
      </tr>
      <tr>
        <td>cell 1</td>
        <td>cell 2</td>
      </tr>
    </table>
  `;

  it('should traverse a DOM using IDs', () => {
    const dom = load(htmlNestedIds);
    const result1 = navigate(dom, ['#second']);
    expect(result1.html()).toMatch(/^\s*How are you/);

    const result2 = navigate(dom, ['#second', '#third']);
    expect(result2.html()).toMatch(/^\s*Bye bye/);
  });

  it('should traverse a DOM using tag names, using the first element', () => {
    const dom = load(htmlTable);
    expect(navigate(dom, ['table', 'tr', 'td', 'span']).html()).toMatch(
      /^\s*text inside span/,
    );
    expect(navigate(dom, ['table', 'div']).html()).toMatch(/^\s*Inside a div/);
    expect(navigate(dom, ['td', 'a']).html()).toMatch(/^\s*link one/);
  });

  it('should throw error when navigation is incorrect', () => {
    const dom = load(htmlNestedIds);
    expect(() => navigate(dom, ['#first', '#second'])).toThrow();
  });
});

describe(limitMessageLength.name, () => {
  it('trims and limits', () => {
    expect(limitMessageLength('  hello world ', 3)).toBe('hel...');
    expect(limitMessageLength('hello world ', 3)).toBe('hel...');
    expect(limitMessageLength('hello world ', 12)).toBe('hello world');
    expect(limitMessageLength('hello world ', 11)).toBe('hello world');
    expect(limitMessageLength('   hello world ', 12)).toBe('hello world');
    expect(limitMessageLength(' hello world   ', 11)).toBe('hello world');
    expect(limitMessageLength(' hello world   ', 10)).toBe('hello worl...');
    expect(limitMessageLength('hello', 5)).toBe('hello');
    expect(limitMessageLength('hello', 4)).toBe('hell...');
    expect(limitMessageLength('   hello  ', 5)).toBe('hello');
    expect(limitMessageLength('  hello    ', 4)).toBe('hell...');
  });
});

describe(isDev.name, () => {
  it('is always false during testing', () => {
    expect(isDev()).toBeFalsy();
  });
});
describe(isProd.name, () => {
  it('is always false during testing', () => {
    expect(isProd()).toBeFalsy();
  });
});
describe(isTest.name, () => {
  it('is always true during testing', () => {
    expect(isTest()).toBeTruthy();
  });
});

describe(enumKeysToString.name, () => {
  it('obtains the existing keys correctly', () => {
    expect(enumKeysToString(Method, [Method.GET, Method.DELETE])).toStrictEqual(
      ['GET', 'DELETE'],
    );
    expect(enumKeysToString(Method, [Method.DELETE, Method.GET])).toStrictEqual(
      ['DELETE', 'GET'],
    );
  });

  it('obtains undefined when the key does not exist', () => {
    expect(enumKeysToString(Method, [454, Method.PUT])).toStrictEqual([
      undefined,
      'PUT',
    ]);
    expect(enumKeysToString(Method, [Method.POST, -1])).toStrictEqual([
      'POST',
      undefined,
    ]);
  });
});

describe(isArrayOf.name, () => {
  it('checks array of objects', () => {
    expect(isArrayOf([new Function(), new Function()], Function)).toBeTruthy();
    expect(isArrayOf([new Function(), []], Function)).toBeFalsy();
    expect(isArrayOf([[], []], Function)).toBeFalsy();
    expect(isArrayOf([[], []], Array)).toBeTruthy();
  });

  it('checks array of primitive values', () => {
    expect(isArrayOf([1, 2, 3], 'number')).toBeTruthy();
    expect(isArrayOf(['a', 'b', 'c'], 'string')).toBeTruthy();
    expect(isArrayOf([true, false, true], 'boolean')).toBeTruthy();
  });
});
