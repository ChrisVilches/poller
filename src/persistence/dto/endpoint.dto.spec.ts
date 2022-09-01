import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { EndpointDto } from './endpoint.dto';
import { PartialType } from '@nestjs/mapped-types';
import { NavigationDto } from './navigation.dto';
import { ArgumentDto } from './argument.dto';
import { validateAndTransform } from '../../util';
import '@test/matchers/toThrowErrorType';
import { ArgType } from '@persistence/entities/argument.entity';

describe(EndpointDto.name, () => {
  it('trims title', () => {
    const e = new EndpointDto();
    e.title = 'a';
    expect(plainToInstance(EndpointDto, { title: '  a  ' })).toStrictEqual(e);
  });

  it('validates incorrect title', () => {
    const err = validateSync(
      plainToInstance(PartialType(EndpointDto), { title: true }),
    );
    expect(err).not.toHaveLength(0);
  });

  it('trims the title before validating it is not empty (therefore throws error)', () => {
    expect(() =>
      validateAndTransform(PartialType(EndpointDto), { title: '      ' }),
    ).toThrowErrorType(ValidationError);
  });

  it('converts arguments', () => {
    const e = new EndpointDto();
    e.arguments = [1, 'some string', true].map((value: any) => {
      const a = new ArgumentDto();
      // TODO: Improve this line!
      a.type = typeof value === 'number' ? ArgType.NUMBER : (typeof value === 'boolean' ? ArgType.BOOLEAN : ArgType.STRING);
      a.value = `${value}`;
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
          { selector: 'aa' },
          { selector: 'bb' },
          { selector: 'cc' },
        ],
      }),
    ).toStrictEqual(e);
  });
});
