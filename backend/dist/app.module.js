"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const view_controller_1 = require("./view.controller");
const login_controller_1 = require("./login.controller");
const profile_controller_1 = require("./profile.controller");
const user_module_1 = require("./user/user.module");
const pitch_deck_module_1 = require("./pitch-deck/pitch-deck.module");
const comment_module_1 = require("./comment/comment.module");
const favorite_module_1 = require("./favorite/favorite.module");
const meeting_module_1 = require("./meeting/meeting.module");
const message_module_1 = require("./message/message.module");
const notification_module_1 = require("./notification/notification.module");
const offer_module_1 = require("./offer/offer.module");
const pitch_deck_entity_1 = require("./pitch-deck/pitch-deck.entity");
const favorite_entity_1 = require("./favorite/favorite.entity");
const offer_entity_1 = require("./offer/offer.entity");
const notification_entity_1 = require("./notification/notification.entity");
const message_entity_1 = require("./message/message.entity");
const user_entity_1 = require("./user/user.entity");
const meeting_entity_1 = require("./meeting/meeting.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DB_URL,
                synchronize: false,
                ssl: { rejectUnauthorized: false },
                autoLoadEntities: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
            user_module_1.UserModule,
            pitch_deck_module_1.PitchDeckModule,
            comment_module_1.CommentModule,
            favorite_module_1.FavoriteModule,
            meeting_module_1.MeetingModule,
            message_module_1.MessageModule,
            notification_module_1.NotificationModule,
            offer_module_1.OfferModule,
            typeorm_1.TypeOrmModule.forFeature([pitch_deck_entity_1.PitchDeck, favorite_entity_1.Favorite, offer_entity_1.Offer, notification_entity_1.Notification, message_entity_1.Message, user_entity_1.User, meeting_entity_1.Meeting]),
        ],
        controllers: [
            app_controller_1.AppController,
            view_controller_1.ViewController,
            login_controller_1.LoginController,
            profile_controller_1.ProfileController,
        ],
    })
], AppModule);
