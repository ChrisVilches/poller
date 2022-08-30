import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
// import { allRules } from '@rules/allRules';
import { allRules } from '@rules/allRules'

// TODO: Add how arguments / navigations are added
export class CreateEndpointDto {
  @IsOptional()
  @IsString()
  @Transform((params: TransformFnParams) => params.value.trim())
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
