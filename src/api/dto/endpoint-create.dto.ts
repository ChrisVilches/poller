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
  Validate,
} from 'class-validator';
import { allRules } from '@rules/allRules';
import { Trim } from '@transformations/trim.transformation';
import 'reflect-metadata';
import { RequestType } from '@persistence/enum/request-type.enum';
import { Method } from '@persistence/enum/method.enum';
import { enumKeysToString } from '@util/misc';
import { TrimEach } from '@transformations/trim-each.transformation';
import { Uppercase } from '@transformations/uppercase.transformation';
import { CorrectArgsType } from '@api/validators/correct-args-type.validator';

const allowedTypes = [RequestType.HTML, RequestType.DHTML, RequestType.JSON];
const allowedMethods = [
  Method.GET,
  Method.POST,
  Method.PUT,
  Method.PATCH,
  Method.DELETE,
];

export class EndpointCreateDto {
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

  @IsIn(enumKeysToString(RequestType, allowedTypes))
  @IsString()
  @Uppercase()
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

  @IsIn(enumKeysToString(Method, allowedMethods))
  @Uppercase()
  method: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  waitAfterNotificationMinutes: number;

  @IsOptional()
  @IsArray()
  @Validate(CorrectArgsType)
  arguments: (string | number | boolean)[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @TrimEach()
  navigations: string[];
}