import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * TODO: Adding ApiProperty to "order" makes it disappear from the documentation.
 *       Maybe it's because of the type (desc | asc). Maybe it'll appear again
 *       if I specify the type inside the ApiProperty decorator. Removing the
 *       decorator makes it appear again in the documentation.
 *
 *       Anyway, the generated documentation is far from perfect (many things are not
 *       showing, like the page size maximum value, etc).
 */

// TODO: Test this in detail.

const PAGE_SIZE_DEFAULT = 10;
const PAGE_SIZE_MAX = 50;

export class PaginatedQueryDto {
  @IsInt()
  @Min(0, { message: 'page number must be 1 or greater' })
  @IsOptional()
  @Transform((params: TransformFnParams) => +params.value - 1)
  page = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(PAGE_SIZE_MAX)
  @Transform((params: TransformFnParams) => +params.value)
  pageSize: number = PAGE_SIZE_DEFAULT;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsIn(['desc', 'asc'])
  order: 'desc' | 'asc';
}
