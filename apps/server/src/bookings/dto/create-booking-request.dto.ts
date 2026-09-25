import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const emptyToUndefined = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() === '' ? undefined : typeof value === 'string' ? value.trim() : value;

export class CreateBookingRequestDto {
  @IsString()
  @MaxLength(120)
  packageSlug!: string;

  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @Transform(trim)
  @Matches(/^[+0-9()\-\s]{7,20}$/, { message: 'Enter a valid phone number, including the country code' })
  phone!: string;

  @IsInt()
  @Min(1)
  @Max(20)
  adults!: number;

  @IsInt()
  @Min(0)
  @Max(20)
  children!: number;

  /** Preferred start date as YYYY-MM-DD. The service checks it is not in the past. */
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'startDate must be a date in YYYY-MM-DD format' })
  startDate!: string;

  @IsBoolean()
  flexibleDates!: boolean;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(120)
  startingCity?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(1000)
  notes?: string;

  /** The customer agreed to be contacted about this request. */
  @Equals(true, { message: 'Please agree to be contacted about your request' })
  consent!: boolean;

  /** Honeypot: hidden from people in the form, so only bots fill it. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
