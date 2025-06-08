import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('favorites')
export class FavoriteController {
  constructor(
    private readonly service: FavoriteService,
    @InjectRepository(PitchDeck)
    private readonly pitchdeckRepo: Repository<PitchDeck>,
  ) {}

  @Post('toggle/:pitchdeckId')
  async toggleFavorite(
    @Param('pitchdeckId') pitchdeckId: number,
    @Req() req: any,
  ) {
    const user = req.session?.user;
    if (!user) {
      console.warn('⚠️ Aucune session utilisateur trouvée');
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    const pitchdeck = await this.pitchdeckRepo.findOneByOrFail({ id: pitchdeckId });

    return this.service.toggle(user, pitchdeck);
  }

  @Get()
  async getMyFavorites(@Req() req: any) {
    const user = req.session?.user;
    if (!user) throw new UnauthorizedException('Utilisateur non authentifié');

    return this.service.findFavoritesByUser(user.id);
  }
}
