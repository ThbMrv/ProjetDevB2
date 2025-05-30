import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { PitchDeckService } from './pitch-deck.service';
import { PitchDeck } from './pitch-deck.entity';

@Controller('pitch-deck')
export class PitchDeckController {
  constructor(private readonly service: PitchDeckService) {}

  @Get()
  getAll(): Promise<PitchDeck[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<PitchDeck | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<PitchDeck>): Promise<PitchDeck> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<PitchDeck>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
