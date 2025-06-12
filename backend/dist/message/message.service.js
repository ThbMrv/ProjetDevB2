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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./message.entity");
let MessageService = class MessageService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find();
    }
    findOne(id) {
        return this.repo.findOne({ where: { id } });
    }
    create(data) {
        const message = this.repo.create({
            ...data,
            timestamp: new Date(),
        });
        return this.repo.save(message);
    }
    update(id, data) {
        return this.repo.update(id, data);
    }
    remove(id) {
        return this.repo.delete(id);
    }
    async getMessagesBetween(senderId, receiverId) {
        return this.repo.find({
            where: [
                { sender: { id: senderId }, receiver: { id: receiverId } },
                { sender: { id: receiverId }, receiver: { id: senderId } },
            ],
            relations: ['sender', 'receiver'],
            order: { timestamp: 'ASC' },
        });
    }
    async getConversationUsers(userId) {
        const sent = await this.repo.find({
            where: { sender: { id: userId } },
            relations: ['receiver'],
        });
        const received = await this.repo.find({
            where: { receiver: { id: userId } },
            relations: ['sender'],
        });
        const users = [
            ...sent.map(m => m.receiver),
            ...received.map(m => m.sender),
        ];
        return users.filter((user, index, self) => index === self.findIndex(u => u.id === user.id));
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessageService);
