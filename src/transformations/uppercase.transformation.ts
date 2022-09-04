import { Transform, TransformFnParams } from 'class-transformer';

export function Uppercase() {
  return Transform((params: TransformFnParams) =>
    typeof params.value === 'string'
      ? params.value.toUpperCase()
      : params.value,
  );
}
