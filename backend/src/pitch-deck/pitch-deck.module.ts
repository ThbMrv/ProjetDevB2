import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PitchDeck } from './pitch-deck.entity';
import { PitchDeckService } from './pitch-deck.service';
import { PitchDeckController } from './pitch-deck.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PitchDeck])],
  providers: [PitchDeckService],
  controllers: [PitchDeckController],
})
export class PitchDeckModule {}
