import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NavigationDto } from './navigation.dto';

describe(NavigationDto.name, () => {
  it('transforms selector', () => {
    const nav = new NavigationDto();
    nav.selector = 'a';
    expect(plainToInstance(NavigationDto, { selector: '  a  ' })).toStrictEqual(
      nav,
    );
  });

  it('validates incorrect selector', async () => {
    const validateNav = (plain: any) =>
      validate(plainToInstance(NavigationDto, plain));

    expect(await validateNav({ selector: () => 0 })).not.toHaveLength(0);
    expect(await validateNav({ selector: '' })).not.toHaveLength(0);
    expect(await validateNav({ selector: '   ' })).not.toHaveLength(0);
    expect(await validateNav({ selector: true })).not.toHaveLength(0);
    expect(await validateNav({ selector: {} })).not.toHaveLength(0);
    expect(await validateNav({ selector: [] })).not.toHaveLength(0);
    expect(await validateNav({ selector: null })).not.toHaveLength(0);
    expect(await validateNav({ selector: undefined })).not.toHaveLength(0);
    expect(await validateNav({ selector: [1, 2, 3] })).not.toHaveLength(0);
  });
});
