import { IsInt, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDestinationDto {
  @IsString()
  @MinLength(2)
  slug!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(10)
  summary!: string;

  @IsString()
  @MinLength(20)
  overview!: string;

  @IsOptional() @IsString() bestTime?: string;
  @IsOptional() @IsString() howToReach?: string;
  @IsOptional() @IsInt() distanceFromLeh?: number;
  @IsOptional() @IsInt() altitudeMeters?: number;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsString() heroImageUrl?: string;
  @IsOptional() @IsString() categoryId?: string;
}
