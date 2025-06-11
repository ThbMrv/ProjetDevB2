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
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Request, Response } from 'express';
import { SendMessageDto } from '../dto/send-message.dto';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly service: MessageService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ❌ renommée pour éviter conflit
  @Get('all')
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

  @Post('send')
  async sendMessage(
    @Body() body: SendMessageDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = req.session?.user;
    if (!user) return res.status(401).send('Non connecté');

    const sender = await this.userRepo.findOneByOrFail({ id: user.id });

    const recipientId = parseInt(body.recipientId as any, 10);
    if (isNaN(recipientId)) {
      return res.status(400).send('Identifiant destinataire invalide');
    }

    const recipient = await this.userRepo.findOneByOrFail({ id: recipientId });

    await this.service.create({
      sender,
      receiver: recipient,
      content: body.content,
      pitchDeck: body.pitchDeckId ? { id: body.pitchDeckId } as any : null,
      timestamp: new Date(),
    });

    if (body.pitchDeckId) {
      return res.redirect(`/projets/${body.pitchDeckId}`);
    } else {
      return res.redirect(`/messages/conversation/${recipient.id}`);
    }
  }

  // ✅ maintenant cette route est bien unique
  @Get()
  async redirectToFirstConversation(@Req() req: Request, @Res() res: Response) {
    const user = req.session?.user;
    if (!user) return res.status(401).send('Non connecté');

    const conversations = await this.service.getConversationUsers(user.id);

    if (conversations.length > 0) {
      return res.redirect(`/messages/conversation/${conversations[0].id}`);
    } else {
      return res.render('messages', {
        user,
        projects: [],
        messages: [],
        conversations: [],
        selectedConversationId: null,
        selectedConversationUser: null,
      });
    }
  }

  @Get('conversation/:recipientId')
  async getConversation(
    @Param('recipientId') recipientId: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = req.session?.user;
    if (!user) return res.status(401).send('Non connecté');

    const messages = await this.service.getMessagesBetween(user.id, recipientId);
    const conversations = await this.service.getConversationUsers(user.id);
    const recipient = await this.userRepo.findOneBy({ id: recipientId });

    res.render('messages', {
      user,
      projects: [],
      messages,
      conversations: conversations.map(u => ({ id: u.id, otherUserName: u.name })),
      selectedConversationId: recipientId,
      selectedConversationUser: recipient?.name || 'Utilisateur',
    });
  }
}

