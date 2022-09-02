import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { NavigationDto } from './navigation.dto';

describe(NavigationDto.name, () => {
  it('transforms selector', () => {
    const nav = new NavigationDto();
    nav.selector = 'a';
    expect(plainToInstance(NavigationDto, { selector: '  a  ' })).toStrictEqual(
      nav,
    );
  });

  it('validates incorrect selector', () => {
    expect(
      validateSync(
        plainToInstance(NavigationDto, {
          selector: () => 0,
        }),
      ),
    ).not.toHaveLength(0);
    expect(
      validateSync(plainToInstance(NavigationDto, { selector: '' })),
    ).not.toHaveLength(0);
    expect(
      validateSync(plainToInstance(NavigationDto, { selector: true })),
    ).not.toHaveLength(0);
    expect(
      validateSync(plainToInstance(NavigationDto, { selector: {} })),
    ).not.toHaveLength(0);
  });
});
