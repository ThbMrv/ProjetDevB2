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
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("./favorite.entity");
let FavoriteService = class FavoriteService {
    constructor(repo) {
        this.repo = repo;
    }
    async toggle(user, pitchdeck) {
        const existing = await this.repo.findOne({
            where: {
                user: { id: user.id },
                pitchdeck: { id: pitchdeck.id },
            },
        });
        if (existing) {
            await this.repo.remove(existing);
            return { favorited: false };
        }
        const favorite = this.repo.create({ user, pitchdeck });
        await this.repo.save(favorite);
        return { favorited: true };
    }
    async findFavoritesByUser(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
            relations: ['pitchdeck'],
        });
    }
};
exports.FavoriteService = FavoriteService;
exports.FavoriteService = FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FavoriteService);
