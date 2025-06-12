"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitchDeckController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
let PitchDeckController = class PitchDeckController {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getProjet(id, req) {
        const user = req.session?.user;
        if (!user)
            return { accessDenied: true };
        const [project] = await this.dataSource.query(`SELECT p.*, u.name AS "ownerName", u.id AS "ownerId"
       FROM pitch_deck p
       JOIN "user" u ON u.id = p."userId"
       WHERE p.id = $1`, [id]);
        if (!project)
            return { notFound: true };
        const isOwner = project.userId === user.id;
        return {
            project,
            user,
            isOwner,
        };
    }
    async getEditForm(id, req) {
        const user = req.session?.user;
        if (!user)
            return { accessDenied: true };
        const [project] = await this.dataSource.query(`SELECT * FROM pitch_deck WHERE id = $1`, [id]);
        if (!project)
            return { notFound: true };
        if (project.userId !== user.id)
            return { forbidden: true };
        return {
            project,
            user,
        };
    }
    async updateProject(id, req, res, body, files) {
        const user = req.session?.user;
        if (!user)
            return res.status(403).send('Non autorisé');
        const [project] = await this.dataSource.query(`SELECT * FROM pitch_deck WHERE id = $1`, [id]);
        if (!project || project.userId !== user.id) {
            return res.status(403).send('Accès refusé');
        }
        const image = files.image?.[0];
        const pdf = files.pdf?.[0];
        await this.dataSource.query(`UPDATE pitch_deck
       SET file = $1, amount = $2, "imageUrl" = $3, description = $4, "pdfUrl" = $5
       WHERE id = $6`, [
            body.file,
            parseFloat(body.amount),
            image ? `/uploads/${image.filename}` : project.imageUrl,
            body.description || project.description,
            pdf ? `/uploads/${pdf.filename}` : project.pdfUrl,
            id,
        ]);
        res.redirect(`/projets/${id}`);
    }
    async deleteProject(id, req, res) {
        const user = req.session?.user;
        if (!user)
            return res.status(403).send('Non autorisé');
        const [project] = await this.dataSource.query(`SELECT * FROM pitch_deck WHERE id = $1`, [id]);
        if (!project || project.userId !== user.id) {
            return res.status(403).send('Accès refusé');
        }
        await this.dataSource.query(`DELETE FROM pitch_deck WHERE id = $1`, [id]);
        res.redirect('/accueil');
    }
    async createProject(req, res, body, files) {
        const user = req.session?.user;
        if (!user || user.role !== 'creator') {
            return res.status(403).send('Non autorisé');
        }
        const image = files.image?.[0];
        const pdf = files.pdf?.[0];
        await this.dataSource.query(`INSERT INTO pitch_deck (file, amount, "imageUrl", "userId", description, status, "pdfUrl")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            body.file,
            parseFloat(body.amount),
            image ? `/uploads/${image.filename}` : null,
            user.id,
            body.description || '',
            'en cours',
            pdf ? `/uploads/${pdf.filename}` : null,
        ]);
        res.redirect('/accueil');
    }
};
exports.PitchDeckController = PitchDeckController;
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.Render)('projet'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PitchDeckController.prototype, "getProjet", null);
__decorate([
    (0, common_1.Get)('/:id/edit'),
    (0, common_1.Render)('edit-projet'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PitchDeckController.prototype, "getEditForm", null);
__decorate([
    (0, common_1.Post)('/:id/edit'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads',
            filename: (_req, file, cb) => {
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `file-${(0, uuid_1.v4)()}${ext}`);
            },
        }),
        fileFilter: (_req, file, cb) => {
            if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
                return cb(new Error('Le fichier PDF est invalide'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PitchDeckController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Post)('/:id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PitchDeckController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Post)('/create-with-upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads',
            filename: (_req, file, cb) => {
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `file-${(0, uuid_1.v4)()}${ext}`);
            },
        }),
        fileFilter: (_req, file, cb) => {
            if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
                return cb(new Error('Le fichier PDF est invalide'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PitchDeckController.prototype, "createProject", null);
exports.PitchDeckController = PitchDeckController = __decorate([
    (0, common_1.Controller)('pitch-deck'),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PitchDeckController);
