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
exports.FavoriteController = void 0;
const common_1 = require("@nestjs/common");
const favorite_service_1 = require("./favorite.service");
const pitch_deck_entity_1 = require("../pitch-deck/pitch-deck.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let FavoriteController = class FavoriteController {
    constructor(service, pitchdeckRepo) {
        this.service = service;
        this.pitchdeckRepo = pitchdeckRepo;
    }
    async toggleFavorite(pitchdeckId, req) {
        const user = req.session?.user;
        if (!user) {
            console.warn('⚠️ Aucune session utilisateur trouvée');
            throw new common_1.UnauthorizedException('Utilisateur non authentifié');
        }
        const pitchdeck = await this.pitchdeckRepo.findOneByOrFail({ id: pitchdeckId });
        return this.service.toggle(user, pitchdeck);
    }
    async getMyFavorites(req) {
        const user = req.session?.user;
        if (!user)
            throw new common_1.UnauthorizedException('Utilisateur non authentifié');
        return this.service.findFavoritesByUser(user.id);
    }
};
exports.FavoriteController = FavoriteController;
__decorate([
    (0, common_1.Post)('toggle/:pitchdeckId'),
    __param(0, (0, common_1.Param)('pitchdeckId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getMyFavorites", null);
exports.FavoriteController = FavoriteController = __decorate([
    (0, common_1.Controller)('favorites'),
    __param(1, (0, typeorm_1.InjectRepository)(pitch_deck_entity_1.PitchDeck)),
    __metadata("design:paramtypes", [favorite_service_1.FavoriteService,
        typeorm_2.Repository])
], FavoriteController);
