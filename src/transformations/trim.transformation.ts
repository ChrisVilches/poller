import { Transform, TransformFnParams } from 'class-transformer';

export function Trim() {
  return Transform((params: TransformFnParams) =>
    typeof params.value === 'string' ? params.value.trim() : params.value,
  );
}
