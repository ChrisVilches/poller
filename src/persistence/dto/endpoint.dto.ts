import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { allRules } from '@rules/allRules';
import { validateAndTransform } from '../../util';
import { ArgumentDto } from './argument.dto';
import { NavigationDto } from './navigation.dto';
import 'reflect-metadata';

export class EndpointDto {
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
  @Transform((params: TransformFnParams) =>
    params.value.map((arg: any) =>
      validateAndTransform(ArgumentDto, { value: arg }),
    ),
  )
  @Type(() => ArgumentDto)
  arguments: any[];

  @Transform((params: TransformFnParams) =>
    params.value.map((selector: string) =>
      validateAndTransform(NavigationDto, { selector }),
    ),
  )
  @Type(() => NavigationDto)
  @IsOptional()
  @IsArray()
  navigations: string[];

  // TODO: IsBoolean works manually but not via pipes. Probably a framework bug.
  @IsOptional()
  @IsBoolean()
  staticHtml: boolean;
}
