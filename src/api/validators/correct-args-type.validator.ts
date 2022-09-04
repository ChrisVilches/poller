import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'correctArgsType', async: false })
export class CorrectArgsType implements ValidatorConstraintInterface {
  validate(data: any, _args: ValidationArguments) {
    const correctType = (v: any) =>
      ['string', 'boolean', 'number'].includes(typeof v);
    return data.reduce(
      (accum: boolean, elem: any) => accum && correctType(elem),
      true,
    );
  }

  defaultMessage(_args: ValidationArguments) {
    return 'only numbers, strings, and booleans allowed';
  }
}
