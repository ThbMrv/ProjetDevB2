import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private repo: Repository<Offer>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Offer>) {
    const offer = this.repo.create(data);
    return this.repo.save(offer);
  }

  update(id: number, data: Partial<Offer>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
