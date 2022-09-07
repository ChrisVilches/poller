import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { EndpointDto } from './endpoint.dto';
import { PartialType } from '@nestjs/mapped-types';
import { NavigationDto } from './navigation.dto';
import { ArgumentDto } from './argument.dto';
import '@test/matchers/toThrowErrorType';
import { transformAndValidate } from 'class-transformer-validator';
import { valueToArgType } from '@util/misc';

describe(EndpointDto.name, () => {
  it('trims title', () => {
    const e = new EndpointDto();
    e.title = 'a';
    expect(plainToInstance(EndpointDto, { title: '  a  ' })).toStrictEqual(e);
  });

  it('validates incorrect title', async () => {
    const err = await validate(
      plainToInstance(PartialType(EndpointDto), { title: true }),
    );
    expect(err).not.toHaveLength(0);
  });

  it('trims the title before validating it is not empty (therefore throws error)', async () => {
    await expect(
      async () =>
        await transformAndValidate(PartialType(EndpointDto), { title: '   ' }),
    ).toThrowErrorType(ValidationError);
  });

  it('converts arguments', () => {
    const e = new EndpointDto();
    e.arguments = [1, 'some string', true].map((value: any) => {
      const a = new ArgumentDto();
      a.type = valueToArgType(value);
      a.value = value;
      return a;
    }) as any;

    const instance: EndpointDto = plainToInstance(EndpointDto, {
      arguments: [{ value: 1 }, { value: 'some string' }, { value: true }],
    });
    expect(instance).toStrictEqual(e);
  });

  it('converts navigations', () => {
    const e = new EndpointDto();

    e.navigations = ['aa', 'bb', 'cc'].map((s: string) => {
      const n = new NavigationDto();
      n.selector = s;
      return n;
    }) as any;
    expect(
      plainToInstance(EndpointDto, {
        navigations: [
          { selector: ' aa ' },
          { selector: 'bb  ' },
          { selector: '  cc' },
        ],
      }),
    ).toStrictEqual(e);
  });
});
