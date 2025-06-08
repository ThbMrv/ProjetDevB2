import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity'; // 👈 importer l'entité

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, PitchDeck])], // 👈 ajouter PitchDeck ici
  providers: [FavoriteService],
  controllers: [FavoriteController],
  exports: [FavoriteService],
})
export class FavoriteModule {}
