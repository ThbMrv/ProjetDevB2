import { Controller, Post, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';

@Controller('offers')
export class OfferController {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(PitchDeck)
    private readonly pitchRepo: Repository<PitchDeck>,
  ) {}

  @Post(':id/accept')
  async accept(@Param('id') id: number) {
    const offer = await this.offerRepo.findOne({
      where: { id },
      relations: ['pitchDeck'],
    });

    if (!offer) throw new NotFoundException('Offre introuvable');

    offer.pitchDeck.status = 'terminé'; // ou "accepted" si tu préfères
    await this.pitchRepo.save(offer.pitchDeck);

    return { message: 'Offre acceptée ✅' };
  }

  @Post(':id/reject')
  async reject(@Param('id') id: number) {
    // Ici tu peux juste retourner un message, ou supprimer l’offre, ou ne rien faire
    return { message: 'Offre refusée ❌' };
  }
}
