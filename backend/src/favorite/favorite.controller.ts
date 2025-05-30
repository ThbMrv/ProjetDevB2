import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Favorite } from './favorite.entity';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Get()
  getAll(): Promise<Favorite[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Favorite | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Favorite>): Promise<Favorite> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Favorite>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
