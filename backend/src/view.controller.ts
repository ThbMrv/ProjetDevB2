import { Controller, Get, Render, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';

@Controller()
export class ViewController {
  constructor(private dataSource: DataSource) {}

  @Get('/login')
  @Render('login')
  getLoginView() {
    return {};
  }

  @Get('/accueil')
  @Render('accueil')
  async getAccueilView(@Req() req: Request) {
    const user = req.session?.user;
    if (!user) return { user: null };

    const projectsRaw = await this.dataSource.query(
      `SELECT * FROM pitch_deck ORDER BY id DESC`
    );

    const projects = projectsRaw.map((p: any) => ({
      ...p,
      imageurl: p.imageUrl,
    }));

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      isCreator: user.role === 'creator',
      projects,
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

    const [project] = await this.dataSource.query(
      `SELECT pd.*, u.name AS "ownerName"
       FROM pitch_deck pd
       LEFT JOIN "user" u ON u.id = pd."userId"
       WHERE pd.id = $1`,
      [id],
    );

    if (!project) return { notFound: true };

    return {
      project: {
        ...project,
        imageurl: project.imageUrl,
        ownerName: project.ownerName || 'Inconnu',
      },
      isOwner: user.id === project.userId,
      user,
    };
  }
}
