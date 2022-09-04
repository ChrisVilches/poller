import { isArrayOf } from '@util/misc';
import { Transform, TransformFnParams } from 'class-transformer';

export function TrimEach() {
  return Transform((params: TransformFnParams) =>
    isArrayOf(params.value, 'string')
      ? params.value.map((s: string) => s.trim())
      : params.value,
  );
}
