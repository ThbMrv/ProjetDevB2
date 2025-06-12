import { Controller, Post, Param, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';
import { Response } from 'express';

@Controller('offers')
export class OfferController {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(PitchDeck)
    private readonly pitchRepo: Repository<PitchDeck>,
  ) {}

  @Post(':id/accept')
  async accept(@Param('id') id: number, @Res() res: Response) {
    const offer = await this.offerRepo.findOne({
      where: { id },
      relations: ['pitchDeck'],
    });

    if (!offer) throw new NotFoundException('Offre introuvable');

    offer.pitchDeck.status = 'terminé'; // ou 'accepted' si c'est ta convention
    await this.pitchRepo.save(offer.pitchDeck);

    return res.redirect('/accueil');
  }

  @Post(':id/reject')
  async reject(@Param('id') id: number, @Res() res: Response) {
    // Tu peux faire un traitement ici si besoin
    return res.redirect('/accueil');
  }
}
