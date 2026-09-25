import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export const CONTACT_TOPICS = ['general', 'trip-planning', 'correction', 'feedback', 'partnership'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateContactMessageDto {
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsIn(CONTACT_TOPICS)
  topic!: ContactTopic;

  @Transform(trim)
  @IsString()
  @MinLength(10, { message: 'Please write at least a sentence so we can help.' })
  @MaxLength(2000)
  message!: string;

  /** Honeypot: hidden from people in the form, so only bots fill it. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
