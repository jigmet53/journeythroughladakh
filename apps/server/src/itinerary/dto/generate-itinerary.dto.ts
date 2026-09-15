import { IsArray, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const FITNESS_LEVELS = ['easy', 'moderate', 'strenuous'] as const;
export type FitnessLevel = (typeof FITNESS_LEVELS)[number];

/** BRD.md §15's planner input set. Only startingCity/days/budget/travelStyle
 * are persisted on the Itinerary (schema columns) — interests/fitnessLevel
 * only steer which destinations the generator picks. */
export class GenerateItineraryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  startingCity?: string;

  @IsInt()
  @Min(1)
  @Max(21)
  days!: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  budget?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  travelStyle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsIn(FITNESS_LEVELS)
  fitnessLevel?: FitnessLevel;
}
