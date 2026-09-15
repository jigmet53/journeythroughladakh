import { IsEnum } from 'class-validator';
import { ItineraryVisibility } from '@prisma/client';

export class UpdateVisibilityDto {
  @IsEnum(ItineraryVisibility)
  visibility!: ItineraryVisibility;
}
