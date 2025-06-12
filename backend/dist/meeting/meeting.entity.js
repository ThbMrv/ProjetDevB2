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
exports.Meeting = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const pitch_deck_entity_1 = require("../pitch-deck/pitch-deck.entity");
let Meeting = class Meeting {
};
exports.Meeting = Meeting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Meeting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Meeting.prototype, "meeting_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.meetings, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Meeting.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pitch_deck_entity_1.PitchDeck, (pitchDeck) => pitchDeck.meetings, { onDelete: 'CASCADE' }),
    __metadata("design:type", pitch_deck_entity_1.PitchDeck)
], Meeting.prototype, "pitchDeck", void 0);
exports.Meeting = Meeting = __decorate([
    (0, typeorm_1.Entity)()
], Meeting);
