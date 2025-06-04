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

  // 🔄 Afficher le formulaire d’édition
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

  // ✅ Enregistrer la modif
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

  // ❌ Supprimer
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
}
