import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Get()
  getAll(): Promise<Message[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Message | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Message>): Promise<Message> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Message>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
