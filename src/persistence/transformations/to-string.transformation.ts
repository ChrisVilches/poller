import { Transform, TransformFnParams } from 'class-transformer';

export function ToString() {
  return Transform((params: TransformFnParams) => `${params.value}`);
}
