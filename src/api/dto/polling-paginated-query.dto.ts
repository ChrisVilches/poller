import { IsIn } from 'class-validator';
import { PaginatedQueryDto } from './paginated-query.dto';

export class PollingPaginatedQueryDto extends PaginatedQueryDto {
  @IsIn(['endpointId', 'createdAt', 'responseCode', 'manual', 'shouldNotify'])
  sortBy = 'createdAt';
}
