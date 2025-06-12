import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.entity';
import { Request, Response } from 'express';

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

  // ✅ Gère le bouton "Prendre RDV" côté front JS
  @Post('/projets/:id/rdv')
  async prendreRDV(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ success: false, message: 'Non authentifié' });

    const { meeting_date } = req.body;
    if (!meeting_date) return res.status(400).json({ success: false, message: 'Date manquante' });

    await this.service.create({
      meeting_date: new Date(meeting_date),
      user: { id: user.id } as any,
      pitchDeck: { id } as any,
    });

    return res.status(200).json({ success: true });
  }
}
