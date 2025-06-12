"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const pitch_deck_entity_1 = require("../pitch-deck/pitch-deck.entity");
const comment_entity_1 = require("../comment/comment.entity");
const message_entity_1 = require("../message/message.entity");
const favorite_entity_1 = require("../favorite/favorite.entity");
const notification_entity_1 = require("../notification/notification.entity");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                pitch_deck_entity_1.PitchDeck,
                comment_entity_1.Comment,
                message_entity_1.Message,
                favorite_entity_1.Favorite,
                notification_entity_1.Notification,
            ]),
        ],
        providers: [user_service_1.UserService],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService],
    })
], UserModule);
