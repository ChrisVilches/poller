import { ArgType } from '@persistence/enum/arg-type.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ArgumentDto } from './argument.dto';

describe(ArgumentDto.name, () => {
  it('transforms type', () => {
    let arg: ArgumentDto;
    arg = new ArgumentDto();
    arg.value = 'a';
    arg.type = ArgType.STRING;
    expect(plainToInstance(ArgumentDto, { value: 'a' })).toStrictEqual(arg);

    arg = new ArgumentDto();
    arg.value = 1;
    arg.type = ArgType.NUMBER;
    expect(plainToInstance(ArgumentDto, { value: 1 })).toStrictEqual(arg);

    arg = new ArgumentDto();
    arg.value = true;
    arg.type = ArgType.BOOLEAN;
    expect(plainToInstance(ArgumentDto, { value: true })).toStrictEqual(arg);
  });

  it('validates incorrect types', async () => {
    const validateArgument = async (plain: any) =>
      await validate(plainToInstance(ArgumentDto, plain));

    expect(await validateArgument({ value: () => 0 })).not.toHaveLength(0);
    expect(await validateArgument({ value: { a: 5 } })).not.toHaveLength(0);
    expect(await validateArgument({ value: null })).not.toHaveLength(0);
    expect(await validateArgument({ value: [] })).not.toHaveLength(0);
    expect(await validateArgument({ value: undefined })).not.toHaveLength(0);
  });
});
