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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitchDeck = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const comment_entity_1 = require("../comment/comment.entity");
const message_entity_1 = require("../message/message.entity");
const favorite_entity_1 = require("../favorite/favorite.entity");
const offer_entity_1 = require("../offer/offer.entity");
let PitchDeck = class PitchDeck {
};
exports.PitchDeck = PitchDeck;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PitchDeck.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.pitchDecks),
    __metadata("design:type", user_entity_1.User)
], PitchDeck.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PitchDeck.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], PitchDeck.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PitchDeck.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.pitchDeck),
    __metadata("design:type", Array)
], PitchDeck.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.pitchDeck),
    __metadata("design:type", Array)
], PitchDeck.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => favorite_entity_1.Favorite, (favorite) => favorite.pitchdeck),
    __metadata("design:type", Array)
], PitchDeck.prototype, "favorites", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PitchDeck.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'en cours' }),
    __metadata("design:type", String)
], PitchDeck.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PitchDeck.prototype, "pdfUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => offer_entity_1.Offer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'acceptedOfferId' }),
    __metadata("design:type", offer_entity_1.Offer)
], PitchDeck.prototype, "acceptedOffer", void 0);
exports.PitchDeck = PitchDeck = __decorate([
    (0, typeorm_1.Entity)()
], PitchDeck);
