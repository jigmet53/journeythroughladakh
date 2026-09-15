import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PackageDayDto } from './package-day.dto';

export class CreatePackageDto {
  @IsString() @MinLength(2) slug!: string;
  @IsString() @MinLength(2) title!: string;
  @IsString() @MinLength(5) tagline!: string;
  @IsString() @MinLength(20) summary!: string;

  @IsInt() @Min(1) days!: number;
  @IsInt() @Min(0) nights!: number;

  @IsString() difficulty!: string;
  @IsString() bestTime!: string;
  @IsString() startCity!: string;

  @IsOptional() @IsString() estimatedBudget?: string;
  @IsOptional() @IsString() heroImageUrl?: string;

  @IsArray() @IsString({ each: true }) bestFor!: string[];
  @IsArray() @IsString({ each: true }) highlights!: string[];
  @IsArray() @IsString({ each: true }) thingsToKnow!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PackageDayDto)
  itinerary!: PackageDayDto[];
}
