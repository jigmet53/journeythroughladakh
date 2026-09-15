import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { RagModule } from '../rag/rag.module';
import { DestinationsModule } from '../destinations/destinations.module';
import { ItineraryModule } from '../itinerary/itinerary.module';

@Module({
  imports: [RagModule, DestinationsModule, ItineraryModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
