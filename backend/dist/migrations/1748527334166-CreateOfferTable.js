"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOfferTable1748527334166 = void 0;
const typeorm_1 = require("typeorm");
class CreateOfferTable1748527334166 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'offer',
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'user_id', type: 'int' },
                { name: 'pitch_deck_id', type: 'int' },
                { name: 'amount', type: 'float' },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('offer');
    }
}
exports.CreateOfferTable1748527334166 = CreateOfferTable1748527334166;
