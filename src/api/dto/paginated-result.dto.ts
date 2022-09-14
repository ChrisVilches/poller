export class PaginatedResultDto<T> {
  count: number;
  data: T[];
}
