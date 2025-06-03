import { Controller, Get, Render, Req } from '@nestjs/common';
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

    if (!user) {
      return { user: null };
    }

    // Récupérer TOUS les projets
    const projectsRaw = await this.dataSource.query(
      `SELECT * FROM pitch_deck ORDER BY id DESC`
    );

    // ⚠️ Corriger les noms de propriété pour Handlebars
    const projects = projectsRaw.map((p: { imageUrl: any; }) => ({
      ...p,
      imageurl: p.imageUrl, // camelCase vers lowerCase pour Handlebars
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
}
