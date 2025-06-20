import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Param,
  UnauthorizedException,
  Redirect,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PitchDeck } from './pitch-deck/pitch-deck.entity';
import { Favorite } from './favorite/favorite.entity';
import { Offer } from './offer/offer.entity';
import { User } from './user/user.entity';
import { Notification } from './notification/notification.entity';
import { Message } from './message/message.entity';
import { Meeting } from './meeting/meeting.entity';

@Controller()
export class ViewController {
  constructor(
    @InjectRepository(PitchDeck)
    private readonly pitchdeckRepo: Repository<PitchDeck>,
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Meeting)
  private readonly meetingRepo: Repository<Meeting>,
  ) {}

  @Get('/login')
  @Render('login')
  getLoginView(@Query('error') error: string) {
    return { error };
  }

  @Get('/accueil')
@Render('accueil')
async getAccueilView(@Req() req: Request) {
  const user = req.session?.user;
  if (!user) return { user: null };

  const allProjects = await this.pitchdeckRepo.find();
  const favorites = await this.favoriteRepo.find({
    where: { user: { id: user.id } },
    relations: ['pitchdeck'],
  });

  const favoriteIds = favorites.map(f => f.pitchdeck.id);

  const projects = allProjects.map(p => ({
    ...p,
    isFavorite: favoriteIds.includes(p.id),
    imageurl: p.imageUrl,
    status: p.status, // 👈 nouveau champ ajouté pour affichage
  }));

  const rawNotifs = await this.notifRepo.find({
    where: { user: { id: user.id } },
    order: { id: 'DESC' },
    take: 5,
  });

  await this.notifRepo.delete({ user: { id: user.id } });

  const offers = await this.offerRepo.find({
    relations: ['user', 'pitchDeck'],
  });

  const notifications = rawNotifs.map((notif) => {
    const related = offers.find(
      (o) =>
        notif.message.includes(o.user.name) &&
        notif.message.includes(`${o.amount}`) &&
        notif.message.includes(o.pitchDeck.file)
    );

    return {
      ...notif,
      type: related ? 'offer' : 'other',
      offerId: related?.id,
      offerStatus: related?.pitchDeck.status ?? 'en cours',
    };
  });

  const conversations = await this.messageRepo
    .createQueryBuilder('message')
    .leftJoinAndSelect('message.sender', 'sender')
    .leftJoinAndSelect('message.receiver', 'receiver')
    .where('sender.id = :id OR receiver.id = :id', { id: user.id })
    .getMany();

  const users = [
    ...conversations.map(m => m.sender),
    ...conversations.map(m => m.receiver),
  ].filter(u => u.id !== user.id);

  const uniqueUsers = users.filter(
    (u, i, arr) => arr.findIndex(x => x.id === u.id) === i
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    isCreator: user.role === 'creator',
    projects,
    notifications,
    conversations: uniqueUsers.map(u => ({
      id: u.id,
      otherUserName: u.name,
    })),
    messages: [],
    selectedConversationId: null,
    selectedConversationUser: null,
  };
}

  @Get('/creer-projet')
  @Render('creer-projet')
  getCreerProjetView(@Req() req: Request) {
    const user = req.session?.user;
    if (!user || user.role !== 'creator') {
      return { accessDenied: true };
    }

    return {
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  @Get('/projets/:id')
  @Render('projet')
  async getOneProject(@Param('id') id: number, @Req() req: Request) {
    const user = req.session?.user;
    if (!user) return { accessDenied: true };

    const project = await this.pitchdeckRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!project) return { notFound: true };

    const isFavorite = await this.favoriteRepo.findOne({
      where: {
        user: { id: user.id },
        pitchdeck: { id: project.id },
      },
    });

    const notifications = await this.notifRepo.find({
      where: { user: { id: user.id } },
      order: { id: 'DESC' },
      take: 5,
    });

    return {
      project: {
        ...project,
        imageurl: project.imageUrl,
        ownerName: project.user?.name || 'Inconnu',
        ownerId: project.user?.id,
      },
      isOwner: user.id === project.user.id,
      isFavorite: !!isFavorite,
      isInvestor: user.role === 'investor',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      notifications,
    };
  }

  @Post('/projets/:id/rdv')
  async createMeeting(
    @Param('id') pitchId: number,
    @Body('date') date: string,
    @Req() req: Request
  ) {
    const user = req.session?.user;
    if (!user || user.role !== 'investor') {
      throw new UnauthorizedException();
    }

    const pitch = await this.pitchdeckRepo.findOne({ where: { id: pitchId } });
    if (!pitch) throw new NotFoundException("Projet introuvable");

    const meeting = this.meetingRepo.create({
      meeting_date: new Date(date),
      user: { id: user.id } as any,
      pitchDeck: { id: pitch.id } as any,
    });

    await this.meetingRepo.save(meeting);

    const notif = this.notifRepo.create({
      user: pitch.user,
      message: `${user.name} a pris rendez-vous pour le projet "${pitch.file}"`,
    });

    await this.notifRepo.save(notif);

    return { success: true };
  }


  @Post('/projets/:id/offre')
  async makeOffer(
    @Param('id') projectId: number,
    @Body('amount') amount: number,
    @Req() req: Request
  ) {
    const user = req.session?.user;
    if (!user || user.role !== 'investor') {
      throw new UnauthorizedException();
    }

    const pitch = await this.pitchdeckRepo.findOne({
      where: { id: projectId },
      relations: ['user'],
    });

    if (!pitch) throw new UnauthorizedException();

    const offer = this.offerRepo.create({
      amount,
      user: { id: user.id } as User,
      pitchDeck: { id: projectId } as PitchDeck,
    });

    await this.offerRepo.save(offer);

    const notif = this.notifRepo.create({
      user: pitch.user,
      message: `${user.name} a fait une offre de ${amount} € sur votre projet "${pitch.file}"`,
    });
    await this.notifRepo.save(notif);

    return { success: true };
  }

  @Post('/projets/:id/message')
  async sendMessage(
    @Param('id') projectId: number,
    @Body('content') content: string,
    @Req() req: Request
  ) {
    const sender = req.session?.user;
    if (!sender) throw new UnauthorizedException();

    const pitch = await this.pitchdeckRepo.findOneOrFail({
      where: { id: projectId },
      relations: ['user'],
    });

    const message = this.messageRepo.create({
      content,
      sender: { id: sender.id },
      receiver: { id: pitch.user.id },
      pitchDeck: { id: pitch.id },
    });
    await this.messageRepo.save(message);

    const notif = this.notifRepo.create({
      user: pitch.user,
      message: `${sender.name} vous a envoyé un message privé concernant le projet "${pitch.file}"`,
    });
    await this.notifRepo.save(notif);

    return { success: true };
  }

  @Get('/profil')
  @Render('profil')
  async getProfilView(@Req() req: Request) {
    const user = req.session?.user;
    if (!user) return { accessDenied: true };

    const meetings = await this.meetingRepo.find({
      where: { user: { id: user.id } },
      relations: ['pitchDeck'],
    });

    const formattedMeetings = meetings.map(m => ({
      pitchName: m.pitchDeck.file,
      date: m.meeting_date.toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    }));

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      meetings: formattedMeetings,
    };
  }


  @Get('/admin')
  @Render('admin')
  async getAdminView(@Req() req: Request) {
    const user = req.session?.user;
    if (!user || user.role !== 'admin') {
      return { accessDenied: true };
    }

    const users = await this.userRepo.find();
    const projects = await this.pitchdeckRepo.find();

    return {
      user,
      users,
      projects,
    };
  }

  @Post('/admin/users/:id/delete')
  @Redirect('/admin')
  async deleteUser(@Param('id') id: number, @Req() req: Request) {
    const user = req.session?.user;
    if (!user || user.role !== 'admin') throw new UnauthorizedException();
    await this.userRepo.delete(id);
  }


  @Get('/mes-favoris')
  @Render('favoris')
  async getMesFavoris(@Req() req: Request) {
    const user = req.session?.user;
    if (!user) return { accessDenied: true };

    const favorites = await this.favoriteRepo.find({
      where: { user: { id: user.id } },
      relations: ['pitchdeck'],
    });

    const projects = favorites.map(f => f.pitchdeck);

    const notifications = await this.notifRepo.find({
      where: { user: { id: user.id } },
      order: { id: 'DESC' },
      take: 5,
    });

    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      projects,
      notifications,
    };
  }

  @Post('/admin/projects/:id/delete')
  @Redirect('/admin')
  async deleteProject(@Param('id') id: number, @Req() req: Request) {
    const user = req.session?.user;
    if (!user || user.role !== 'admin') throw new UnauthorizedException();
    await this.pitchdeckRepo.delete(id);
  }

  @Post('/admin/projects/:id/edit')
  @Redirect('/admin')
  async editProject(
    @Param('id') id: number,
    @Body('file') file: string,
    @Body('status') status: string,
    @Req() req: Request
  ) {
    const user = req.session?.user;
    if (!user || user.role !== 'admin') throw new UnauthorizedException();
    await this.pitchdeckRepo.update(id, { file, status });
  }

}


