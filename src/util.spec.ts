import cheerio from 'cheerio';
import {
  ComparisonOperator,
  comparisonOperator,
  inspectArray,
  navigate,
  removeUrlQueryString,
} from './util';

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
    const dom = cheerio.load(htmlNestedIds);
    const result1 = navigate(dom, ['#second']);
    expect(result1.html()).toMatch(/^\s*How are you/);

    const result2 = navigate(dom, ['#second', '#third']);
    expect(result2.html()).toMatch(/^\s*Bye bye/);
  });

  it('should traverse a DOM using tag names, using the first element', () => {
    const dom = cheerio.load(htmlTable);
    expect(navigate(dom, ['table', 'tr', 'td', 'span']).html()).toMatch(
      /^\s*text inside span/,
    );
    expect(navigate(dom, ['table', 'div']).html()).toMatch(/^\s*Inside a div/);
    expect(navigate(dom, ['td', 'a']).html()).toMatch(/^\s*link one/);
  });

  it('should throw error when navigation is incorrect', () => {
    const dom = cheerio.load(htmlNestedIds);
    expect(() => navigate(dom, ['#first', '#second'])).toThrow();
  });
});
