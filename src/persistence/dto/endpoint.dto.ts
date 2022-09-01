import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { allRules } from '@rules/allRules';
import { ArgumentDto } from './argument.dto';
import { NavigationDto } from './navigation.dto';
import { Trim } from '@persistence/transformations/trim.transformation';
import 'reflect-metadata';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { RequestType } from '@persistence/entities/endpoint.entity';

export class EndpointDto {
  @IsOptional()
  @IsString()
  @Trim()
  title: string;

  @IsOptional()
  @IsString()
  notificationMessage: string;

  @IsIn(Object.keys(allRules))
  rule: string;

  // TODO: Cannot send a "html" string from the HTTP client. Wow... this framework sucks.
  //       Create a transformer pipe.
  @IsIn([RequestType.HTML, RequestType.JSON], { message: "Only HTML and JSON are supported" })
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

// TODO: Observation, for update method, if I don't use THIS type of classes (with the PartialType(...))
//       it throws a unprocessable entity without explanation. Before, I was using Partial<EndpointDto>
//       which failed. Eventually delete this comment.
export class PartialEndpointDto extends PartialType(EndpointDto) {}
