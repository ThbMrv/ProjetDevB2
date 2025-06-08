import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { User } from '../user/user.entity';
import { PitchDeck } from '../pitch-deck/pitch-deck.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,
  ) {}

  async toggle(user: User, pitchdeck: PitchDeck): Promise<{ favorited: boolean }> {
    const existing = await this.repo.findOne({
      where: {
        user: { id: user.id },
        pitchdeck: { id: pitchdeck.id },
      },
    });

    if (existing) {
      await this.repo.remove(existing);
      return { favorited: false };
    }

    const favorite = this.repo.create({ user, pitchdeck });
    await this.repo.save(favorite);
    return { favorited: true };
  }

  async findFavoritesByUser(userId: number): Promise<Favorite[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['pitchdeck'],
    });
  }
}
