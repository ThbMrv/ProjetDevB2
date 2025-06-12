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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const send_message_dto_1 = require("../dto/send-message.dto");
let MessageController = class MessageController {
    constructor(service, userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }
    // ❌ renommée pour éviter conflit
    getAll() {
        return this.service.findAll();
    }
    getOne(id) {
        return this.service.findOne(id);
    }
    create(data) {
        return this.service.create(data);
    }
    update(id, data) {
        return this.service.update(id, data);
    }
    remove(id) {
        return this.service.remove(id);
    }
    async sendMessage(body, req, res) {
        const user = req.session?.user;
        if (!user)
            return res.status(401).send('Non connecté');
        const sender = await this.userRepo.findOneByOrFail({ id: user.id });
        const recipientId = parseInt(body.recipientId, 10);
        if (isNaN(recipientId)) {
            return res.status(400).send('Identifiant destinataire invalide');
        }
        const recipient = await this.userRepo.findOneByOrFail({ id: recipientId });
        await this.service.create({
            sender,
            receiver: recipient,
            content: body.content,
            pitchDeck: body.pitchDeckId ? { id: body.pitchDeckId } : null,
            timestamp: new Date(),
        });
        if (body.pitchDeckId) {
            return res.redirect(`/projets/${body.pitchDeckId}`);
        }
        else {
            return res.redirect(`/messages/conversation/${recipient.id}`);
        }
    }
    // ✅ maintenant cette route est bien unique
    async redirectToFirstConversation(req, res) {
        const user = req.session?.user;
        if (!user)
            return res.status(401).send('Non connecté');
        const conversations = await this.service.getConversationUsers(user.id);
        if (conversations.length > 0) {
            return res.redirect(`/messages/conversation/${conversations[0].id}`);
        }
        else {
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
    async getConversation(recipientId, req, res) {
        const user = req.session?.user;
        if (!user)
            return res.status(401).send('Non connecté');
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
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "redirectToFirstConversation", null);
__decorate([
    (0, common_1.Get)('conversation/:recipientId'),
    __param(0, (0, common_1.Param)('recipientId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getConversation", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        typeorm_2.Repository])
], MessageController);
