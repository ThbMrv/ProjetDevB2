import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferController } from './offer.controller';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, PitchDeck])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
