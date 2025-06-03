import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PitchDeckService } from './pitch-deck.service';
import { PitchDeck } from './pitch-deck.entity';
import { Request, Response } from 'express';
import { Express } from 'express'; // ✅ pour le type Multer.File

@Controller('pitch-deck')
export class PitchDeckController {
  constructor(private readonly service: PitchDeckService) {}

  @Get()
  getAll(): Promise<PitchDeck[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<PitchDeck | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<PitchDeck>): Promise<PitchDeck> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<PitchDeck>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  // ✅ Création projet avec image uploadée
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
  async createWithUpload(
    @UploadedFile() file: Express.Multer.File, // ✅ Type corrigé
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const user = req.session?.user;
    if (!user) return res.status(403).send('Non autorisé');

    const newPitch: Partial<PitchDeck> = {
      user: user, // or user: { id: user.id } if PitchDeck expects a user object
      file: body.file,
      amount: parseFloat(body.amount),
      imageUrl: file ? `/uploads/${file.filename}` : undefined,
    };

    await this.service.create(newPitch);
    return res.redirect('/accueil');
  }
}
