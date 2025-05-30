import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PitchDeck } from './pitch-deck.entity';

@Injectable()
export class PitchDeckService {
  constructor(
    @InjectRepository(PitchDeck)
    private repo: Repository<PitchDeck>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<PitchDeck>) {
    const deck = this.repo.create(data);
    return this.repo.save(deck);
  }

  update(id: number, data: Partial<PitchDeck>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
