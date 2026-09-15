import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ItineraryItemDto {
  @IsOptional()
  @IsString()
  destinationId?: string;

  @IsInt()
  @Min(1)
  order!: number;

  @IsOptional()
  @IsString()
  activity?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ItineraryDayDto {
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryItemDto)
  items!: ItineraryItemDto[];
}

/** Body for both creating (POST) and fully replacing the day/item list of
 * (PATCH) a saved itinerary — matches BRD.md §17's add/remove/reorder/notes
 * editing requirements without needing granular per-item endpoints. */
export class SaveItineraryDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  startingCity?: string;

  @IsInt()
  @Min(1)
  days!: number;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  travelStyle?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDto)
  itineraryDays!: ItineraryDayDto[];
}
