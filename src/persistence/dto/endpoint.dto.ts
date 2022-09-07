import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { allRules } from '@rules/allRules';
import { ArgumentDto } from './argument.dto';
import { NavigationDto } from './navigation.dto';
import { Trim } from '@transformations/trim.transformation';
import 'reflect-metadata';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { RequestType } from '@persistence/enum/request-type.enum';
import { Method } from '@persistence/enum/method.enum';
import { enumKeysToString } from '@util/misc';

const allowedTypes = [RequestType.HTML, RequestType.DHTML, RequestType.JSON];
const allowedMethods = [
  Method.GET,
  Method.POST,
  Method.PUT,
  Method.PATCH,
  Method.DELETE,
];

export class EndpointDto {
  @IsOptional()
  @IsString()
  @Trim()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  @Trim()
  notificationMessage: string;

  @IsIn(Object.keys(allRules))
  rule: string;

  @IsIn(allowedTypes, {
    message: `type must be one of the following values: ${enumKeysToString(
      RequestType,
      allowedTypes,
    ).join(', ')}`,
  })
  type: RequestType;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  periodMinutes: number;

  @IsOptional()
  @IsBoolean()
  not: boolean;

  @IsIn(allowedMethods, {
    message: `method must be one of the following values: ${enumKeysToString(
      Method,
      allowedMethods,
    ).join(', ')}`,
  })
  method: Method;

  @IsOptional()
  @IsInt()
  @IsPositive()
  waitAfterNotificationMinutes: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArgumentDto)
  arguments: ArgumentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavigationDto)
  navigations: NavigationDto[];
}

/**
 * Must use this class for patch method. Using `Partial<T>` does not work.
 */
export class EndpointPartialDto extends PartialType(EndpointDto) {}
