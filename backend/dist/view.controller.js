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
exports.ViewController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pitch_deck_entity_1 = require("./pitch-deck/pitch-deck.entity");
const favorite_entity_1 = require("./favorite/favorite.entity");
const offer_entity_1 = require("./offer/offer.entity");
const user_entity_1 = require("./user/user.entity");
const notification_entity_1 = require("./notification/notification.entity");
const message_entity_1 = require("./message/message.entity");
const meeting_entity_1 = require("./meeting/meeting.entity");
let ViewController = class ViewController {
    constructor(pitchdeckRepo, favoriteRepo, offerRepo, notifRepo, messageRepo, userRepo, meetingRepo) {
        this.pitchdeckRepo = pitchdeckRepo;
        this.favoriteRepo = favoriteRepo;
        this.offerRepo = offerRepo;
        this.notifRepo = notifRepo;
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.meetingRepo = meetingRepo;
    }
    getLoginView(error) {
        return { error };
    }
    async getAccueilView(req) {
        const user = req.session?.user;
        if (!user)
            return { user: null };
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
            const related = offers.find((o) => notif.message.includes(o.user.name) &&
                notif.message.includes(`${o.amount}`) &&
                notif.message.includes(o.pitchDeck.file));
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
        const uniqueUsers = users.filter((u, i, arr) => arr.findIndex(x => x.id === u.id) === i);
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
    getCreerProjetView(req) {
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
    async getOneProject(id, req) {
        const user = req.session?.user;
        if (!user)
            return { accessDenied: true };
        const project = await this.pitchdeckRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!project)
            return { notFound: true };
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
    async createMeeting(pitchId, date, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'investor') {
            throw new common_1.UnauthorizedException();
        }
        const pitch = await this.pitchdeckRepo.findOne({ where: { id: pitchId } });
        if (!pitch)
            throw new common_1.NotFoundException("Projet introuvable");
        const meeting = this.meetingRepo.create({
            meeting_date: new Date(date),
            user: { id: user.id },
            pitchDeck: { id: pitch.id },
        });
        await this.meetingRepo.save(meeting);
        const notif = this.notifRepo.create({
            user: pitch.user,
            message: `${user.name} a pris rendez-vous pour le projet "${pitch.file}"`,
        });
        await this.notifRepo.save(notif);
        return { success: true };
    }
    async makeOffer(projectId, amount, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'investor') {
            throw new common_1.UnauthorizedException();
        }
        const pitch = await this.pitchdeckRepo.findOne({
            where: { id: projectId },
            relations: ['user'],
        });
        if (!pitch)
            throw new common_1.UnauthorizedException();
        const offer = this.offerRepo.create({
            amount,
            user: { id: user.id },
            pitchDeck: { id: projectId },
        });
        await this.offerRepo.save(offer);
        const notif = this.notifRepo.create({
            user: pitch.user,
            message: `${user.name} a fait une offre de ${amount} € sur votre projet "${pitch.file}"`,
        });
        await this.notifRepo.save(notif);
        return { success: true };
    }
    async sendMessage(projectId, content, req) {
        const sender = req.session?.user;
        if (!sender)
            throw new common_1.UnauthorizedException();
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
    async getProfilView(req) {
        const user = req.session?.user;
        if (!user)
            return { accessDenied: true };
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
    async getAdminView(req) {
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
    async deleteUser(id, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'admin')
            throw new common_1.UnauthorizedException();
        await this.userRepo.delete(id);
    }
    async getMesFavoris(req) {
        const user = req.session?.user;
        if (!user)
            return { accessDenied: true };
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
    async deleteProject(id, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'admin')
            throw new common_1.UnauthorizedException();
        await this.pitchdeckRepo.delete(id);
    }
    async editProject(id, file, status, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'admin')
            throw new common_1.UnauthorizedException();
        await this.pitchdeckRepo.update(id, { file, status });
    }
};
exports.ViewController = ViewController;
__decorate([
    (0, common_1.Get)('/login'),
    (0, common_1.Render)('login'),
    __param(0, (0, common_1.Query)('error')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ViewController.prototype, "getLoginView", null);
__decorate([
    (0, common_1.Get)('/accueil'),
    (0, common_1.Render)('accueil'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "getAccueilView", null);
__decorate([
    (0, common_1.Get)('/creer-projet'),
    (0, common_1.Render)('creer-projet'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ViewController.prototype, "getCreerProjetView", null);
__decorate([
    (0, common_1.Get)('/projets/:id'),
    (0, common_1.Render)('projet'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "getOneProject", null);
__decorate([
    (0, common_1.Post)('/projets/:id/rdv'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('date')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "createMeeting", null);
__decorate([
    (0, common_1.Post)('/projets/:id/offre'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "makeOffer", null);
__decorate([
    (0, common_1.Post)('/projets/:id/message'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('/profil'),
    (0, common_1.Render)('profil'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "getProfilView", null);
__decorate([
    (0, common_1.Get)('/admin'),
    (0, common_1.Render)('admin'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "getAdminView", null);
__decorate([
    (0, common_1.Post)('/admin/users/:id/delete'),
    (0, common_1.Redirect)('/admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/mes-favoris'),
    (0, common_1.Render)('favoris'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "getMesFavoris", null);
__decorate([
    (0, common_1.Post)('/admin/projects/:id/delete'),
    (0, common_1.Redirect)('/admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Post)('/admin/projects/:id/edit'),
    (0, common_1.Redirect)('/admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('file')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "editProject", null);
exports.ViewController = ViewController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, typeorm_1.InjectRepository)(pitch_deck_entity_1.PitchDeck)),
    __param(1, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(2, (0, typeorm_1.InjectRepository)(offer_entity_1.Offer)),
    __param(3, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(4, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ViewController);
