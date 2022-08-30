import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Validate,
} from 'class-validator';
import { allRules } from '@rules/allRules';
import { IsStringNumberBoolean } from '@persistence/validators/is-string-number-boolean.validator';

// TODO: Consider removing the "create" part from each DTO.

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

  @IsOptional()
  @IsInt()
  @IsPositive()
  waitAfterNotificationMinutes: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  navigations: string[];

  @IsOptional()
  @IsArray()
  @Validate(IsStringNumberBoolean)
  arguments: (string | number | boolean)[];
}
