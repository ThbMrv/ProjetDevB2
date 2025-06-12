"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeOffer1749747999640 = void 0;
class CascadeOffer1749747999640 {
    constructor() {
        this.name = 'CascadeOffer1749747999640';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7408b50271eb042af72cf8c4740"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7408b50271eb042af72cf8c4740" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7408b50271eb042af72cf8c4740"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7408b50271eb042af72cf8c4740" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.CascadeOffer1749747999640 = CascadeOffer1749747999640;
