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
exports.OfferController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const offer_entity_1 = require("./offer.entity");
const pitch_deck_entity_1 = require("../pitch-deck/pitch-deck.entity");
let OfferController = class OfferController {
    constructor(offerRepo, pitchRepo) {
        this.offerRepo = offerRepo;
        this.pitchRepo = pitchRepo;
    }
    async accept(id) {
        const offer = await this.offerRepo.findOne({
            where: { id },
            relations: ['pitchDeck'],
        });
        if (!offer)
            throw new common_1.NotFoundException('Offre introuvable');
        offer.pitchDeck.status = 'terminé'; // ou "accepted" si tu préfères
        await this.pitchRepo.save(offer.pitchDeck);
        return { message: 'Offre acceptée ✅' };
    }
    async reject(id) {
        // Ici tu peux juste retourner un message, ou supprimer l’offre, ou ne rien faire
        return { message: 'Offre refusée ❌' };
    }
};
exports.OfferController = OfferController;
__decorate([
    (0, common_1.Post)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OfferController.prototype, "reject", null);
exports.OfferController = OfferController = __decorate([
    (0, common_1.Controller)('offers'),
    __param(0, (0, typeorm_1.InjectRepository)(offer_entity_1.Offer)),
    __param(1, (0, typeorm_1.InjectRepository)(pitch_deck_entity_1.PitchDeck)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OfferController);
