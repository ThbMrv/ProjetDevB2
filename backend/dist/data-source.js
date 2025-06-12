"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user/user.entity");
const meeting_entity_1 = require("./meeting/meeting.entity");
const pitch_deck_entity_1 = require("./pitch-deck/pitch-deck.entity");
const offer_entity_1 = require("./offer/offer.entity");
const comment_entity_1 = require("./comment/comment.entity");
const message_entity_1 = require("./message/message.entity");
const favorite_entity_1 = require("./favorite/favorite.entity");
const notification_entity_1 = require("./notification/notification.entity");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: false,
    ssl: { rejectUnauthorized: false },
    logging: true,
    entities: [user_entity_1.User, meeting_entity_1.Meeting, pitch_deck_entity_1.PitchDeck, offer_entity_1.Offer, comment_entity_1.Comment, message_entity_1.Message, favorite_entity_1.Favorite, notification_entity_1.Notification],
    migrations: ['dist/migrations/*.js'],
});
