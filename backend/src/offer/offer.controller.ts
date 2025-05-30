import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { OfferService } from './offer.service';
import { Offer } from './offer.entity';

@Controller('offers')
export class OfferController {
  constructor(private readonly service: OfferService) {}

  @Get()
  getAll(): Promise<Offer[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Offer | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Offer>): Promise<Offer> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Offer>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
