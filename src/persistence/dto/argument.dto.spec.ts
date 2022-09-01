import { ArgType } from '@persistence/entities/argument.entity';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ArgumentDto } from './argument.dto';

describe(ArgumentDto.name, () => {
  it('transforms type', () => {
    let arg: ArgumentDto;
    arg = new ArgumentDto();
    arg.value = 'a';
    arg.type = ArgType.STRING;
    expect(plainToInstance(ArgumentDto, { value: 'a' })).toStrictEqual(arg);

    arg = new ArgumentDto();
    arg.value = '1';
    arg.type = ArgType.NUMBER;
    expect(plainToInstance(ArgumentDto, { value: 1 })).toStrictEqual(arg);

    arg = new ArgumentDto();
    arg.value = 'true';
    arg.type = ArgType.BOOLEAN;
    expect(plainToInstance(ArgumentDto, { value: true })).toStrictEqual(arg);
  });

  it('validates incorrect types', () => {
    expect(
      validateSync(
        plainToInstance(ArgumentDto, {
          value: () => {
            console.log();
          },
        }),
      ),
    ).not.toHaveLength(0);
    expect(
      validateSync(plainToInstance(ArgumentDto, { value: { a: 5 } })),
    ).not.toHaveLength(0);
    expect(
      validateSync(plainToInstance(ArgumentDto, { value: null })),
    ).not.toHaveLength(0);
  });
});
