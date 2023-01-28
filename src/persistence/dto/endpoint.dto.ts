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
import { PartialType } from '@nestjs/mapped-types';
import { RequestType } from '@persistence/enum/request-type.enum';
import { Method } from '@persistence/enum/method.enum';
import { enumKeysToString } from '@util/misc';
import { TrimEach } from '@transformations/trim-each.transformation';
import { CorrectArgsType } from '@validators/correct-args-type.validator';

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

  // TODO: The error is outputted as follows in the UI:
  //       "waitAfterNotificationMinutes must be a positive number"
  //       Should be a human friendly error message.
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

/**
 * Must use this class for patch method. Using `Partial<T>` does not work.
 */
export class EndpointPartialDto extends PartialType(EndpointDto) {}
