import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { GenerateItineraryDto } from './dto/generate-itinerary.dto';
import { SaveItineraryDto } from './dto/save-itinerary.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';

@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('generate')
  generate(@Body() dto: GenerateItineraryDto) {
    return this.itineraryService.generate(dto);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveItineraryDto) {
    return this.itineraryService.create(user.id, dto);
  }

  @Get('mine')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.itineraryService.findMine(user.id);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.itineraryService.findOne(id, user?.id ?? null);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveItineraryDto,
  ) {
    return this.itineraryService.update(id, user.id, dto);
  }

  @Patch(':id/visibility')
  updateVisibility(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateVisibilityDto,
  ) {
    return this.itineraryService.updateVisibility(id, user.id, dto.visibility);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.itineraryService.remove(id, user.id);
  }
}
