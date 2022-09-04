import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

const correctType = (v: any) =>
  ['string', 'boolean', 'number'].includes(typeof v);

@ValidatorConstraint({ name: 'correctArgsType', async: false })
export class CorrectArgsType implements ValidatorConstraintInterface {
  validate(data: any, _args: ValidationArguments) {
    return data.reduce(
      (accum: boolean, elem: any) => accum && correctType(elem),
      true,
    );
  }

  defaultMessage(_args: ValidationArguments) {
    return 'only numbers, strings, and booleans allowed';
  }
}
