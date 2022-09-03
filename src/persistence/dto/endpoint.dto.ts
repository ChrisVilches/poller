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
import { Trim } from '@persistence/transformations/trim.transformation';
import 'reflect-metadata';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { RequestType } from '@persistence/enum/request-type.enum';

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

  @IsIn([RequestType.HTML, RequestType.JSON], {
    message: 'only HTML and JSON are supported',
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

  @IsOptional()
  @IsBoolean()
  staticHtml: boolean;
}

/**
 * Must use this class for patch method. Using `Partial<T>` does not work.
 */
export class PartialEndpointDto extends PartialType(EndpointDto) {}
