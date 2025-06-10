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
  UploadedFiles,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

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
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './public/uploads',
          filename: (_req, file, cb) => {
            const ext = extname(file.originalname);
            cb(null, `file-${uuid()}${ext}`);
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
            return cb(new Error('Le fichier PDF est invalide'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async updateProject(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
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

    const image = files.image?.[0];
    const pdf = files.pdf?.[0];

    await this.dataSource.query(
      `UPDATE pitch_deck
       SET file = $1, amount = $2, "imageUrl" = $3, description = $4, "pdfUrl" = $5
       WHERE id = $6`,
      [
        body.file,
        parseFloat(body.amount),
        image ? `/uploads/${image.filename}` : project.imageUrl,
        body.description || project.description,
        pdf ? `/uploads/${pdf.filename}` : project.pdfUrl,
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

  @Post('/create-with-upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './public/uploads',
          filename: (_req, file, cb) => {
            const ext = extname(file.originalname);
            cb(null, `file-${uuid()}${ext}`);
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
            return cb(new Error('Le fichier PDF est invalide'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async createProject(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
  ) {
    const user = req.session?.user;
    if (!user || user.role !== 'creator') {
      return res.status(403).send('Non autorisé');
    }

    const image = files.image?.[0];
    const pdf = files.pdf?.[0];

    await this.dataSource.query(
      `INSERT INTO pitch_deck (file, amount, "imageUrl", "userId", description, status, "pdfUrl")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        body.file,
        parseFloat(body.amount),
        image ? `/uploads/${image.filename}` : null,
        user.id,
        body.description || '',
        'en cours',
        pdf ? `/uploads/${pdf.filename}` : null,
      ],
    );

    res.redirect('/accueil');
  }
}
