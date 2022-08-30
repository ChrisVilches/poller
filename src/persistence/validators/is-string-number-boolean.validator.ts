import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStringNumberBoolean', async: false })
export class IsStringNumberBoolean implements ValidatorConstraintInterface {
  validate(array: any[], _args: ValidationArguments) {
    return array.reduce(
      (accum, elem) =>
        accum && ['string', 'number', 'boolean'].includes(typeof elem),
      true,
    );
  }

  defaultMessage({ property }: any) {
    return `each value in ${property} must be either string, number or boolean`;
  }
}
