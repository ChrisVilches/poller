import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { allRules } from '../../allRules';

// TODO: Add how arguments / navigations are added
export class CreateEndpointDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  notificationMessage: string;

  @IsIn(Object.keys(allRules))
  rule: string;

  @IsIn(['html', 'json'])
  type: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  periodMinutes: number;

  @IsOptional()
  @IsBoolean()
  not: boolean;
}
