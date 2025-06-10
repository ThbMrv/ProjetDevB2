import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  Res,
  Render,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('pitch-deck')
export class PitchDeckController {
  constructor(private dataSource: DataSource) {}

  @Get('/:id')
  @Render('projet')
  async getProjet(@Param('id') id: number, @Req() req: Request) {
    const user = req.session?.user;
    if (!user) return { accessDenied: true };

    const [project] = await this.dataSource.query(
      `SELECT p.*, u.name AS "ownerName", u.id AS "ownerId"
       FROM pitch_deck p
       JOIN "user" u ON u.id = p."userId"
       WHERE p.id = $1`,
      [id],
    );

    if (!project) return { notFound: true };

    const isOwner = project.userId === user.id;

    return {
      project,
      user,
      isOwner,
    };
  }

  @Get('/:id/edit')
  @Render('edit-projet')
  async getEditForm(@Param('id') id: number, @Req() req: Request) {
    const user = req.session?.user;
    if (!user) return { accessDenied: true };

    const [project] = await this.dataSource.query(
      `SELECT * FROM pitch_deck WHERE id = $1`,
      [id],
    );

    if (!project) return { notFound: true };
    if (project.userId !== user.id) return { forbidden: true };

    return {
      project,
      user,
    };
  }

  @Post('/:id/edit')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateProject(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.session?.user;
    if (!user) return res.status(403).send('Non autorisé');

    const [project] = await this.dataSource.query(
      `SELECT * FROM pitch_deck WHERE id = $1`,
      [id],
    );

    if (!project || project.userId !== user.id) {
      return res.status(403).send('Accès refusé');
    }

    await this.dataSource.query(
      `UPDATE pitch_deck SET file = $1, amount = $2, "imageUrl" = $3 WHERE id = $4`,
      [
        body.file,
        parseFloat(body.amount),
        file ? `/uploads/${file.filename}` : project.imageUrl,
        id,
      ],
    );

    res.redirect(`/projets/${id}`);
  }

  @Post('/:id/delete')
  async deleteProject(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    const user = req.session?.user;
    if (!user) return res.status(403).send('Non autorisé');

    const [project] = await this.dataSource.query(
      `SELECT * FROM pitch_deck WHERE id = $1`,
      [id],
    );

    if (!project || project.userId !== user.id) {
      return res.status(403).send('Accès refusé');
    }

    await this.dataSource.query(`DELETE FROM pitch_deck WHERE id = $1`, [id]);
    res.redirect('/accueil');
  }

  // Création de projet avec upload
@Post('/create-with-upload')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `file-${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
async createProjectWithUpload(
  @Req() req: Request,
  @Res() res: Response,
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
) {
  const user = req.session?.user;
  if (!user) return res.status(403).send('Non autorisé');

  // Crée le projet en BDD (adapte si besoin)
  await this.dataSource.query(
    `INSERT INTO pitch_deck (file, amount, "userId", "imageUrl") VALUES ($1, $2, $3, $4)`,
    [
      body.file,
      parseFloat(body.amount),
      user.id,
      file ? `/uploads/${file.filename}` : null,
    ],
  );

  // Tu peux rediriger vers la liste des projets, ou renvoyer un JSON de confirmation
  res.redirect('/accueil');
  // ou si tu veux une API :
  // res.status(201).json({ message: 'Projet créé avec succès' });
}


  // 🆕 Créer un projet avec image
  @Post('/create-with-upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createProject(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.session?.user;
    if (!user || user.role !== 'creator') {
      return res.status(403).send('Non autorisé');
    }

    const imageUrl = file ? `/uploads/${file.filename}` : null;

    await this.dataSource.query(
      `INSERT INTO pitch_deck (file, amount, "imageUrl", "userId") VALUES ($1, $2, $3, $4)`,
      [body.file, parseFloat(body.amount), imageUrl, user.id],
    );

    res.redirect('/accueil');
  }
}
