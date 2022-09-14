import { PaginatedQueryDto } from '@api/dto/paginated-query.dto';
import { FindManyOptions } from 'typeorm';

export const withPagination = (
  query: PaginatedQueryDto,
  queryOptions: FindManyOptions = {},
): FindManyOptions => {
  const result = {
    ...queryOptions,
    take: query.pageSize,
    skip: query.page * query.pageSize,
  };

  if (query.sortBy) {
    result.order = {
      [query.sortBy]: query.order || 'asc',
    };
  }

  return result;
};
