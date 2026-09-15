import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class PackageDayDto {
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsOptional() @IsString() overnightAt?: string;
  @IsOptional() @IsInt() distanceKm?: number;
  @IsOptional() @IsNumber() driveHours?: number;
  @IsOptional() @IsInt() altitudeMeters?: number;
  @IsOptional() @IsString() destinationId?: string;
}
