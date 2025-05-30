import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Get()
  getAll(): Promise<Comment[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Comment | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Comment>): Promise<Comment> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Comment>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
