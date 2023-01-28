import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { EndpointDto } from './endpoint.dto';
import { PartialType } from '@nestjs/mapped-types';
import '@test/matchers/toThrowErrorType';
import { transformAndValidate } from 'class-transformer-validator';

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
});
