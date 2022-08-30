import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePollingDto {
  @IsPositive()
  @IsInt()
  endpointId: number;

  @IsBoolean()
  shouldNotify: boolean;

  @IsBoolean()
  manual: boolean;

  @IsOptional()
  @IsPositive()
  @IsInt()
  responseCode: number;

  @IsOptional()
  @IsString()
  error: string;
}
