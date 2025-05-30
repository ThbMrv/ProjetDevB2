import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.entity';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly service: MeetingService) {}

  @Get()
  getAll(): Promise<Meeting[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Meeting | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Meeting>): Promise<Meeting> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Meeting>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
