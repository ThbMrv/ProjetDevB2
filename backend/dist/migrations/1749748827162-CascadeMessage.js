"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeMessage1749748827162 = void 0;
class CascadeMessage1749748827162 {
    constructor() {
        this.name = 'CascadeMessage1749748827162';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7f5884a35261cd799d7fad41165"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7f5884a35261cd799d7fad41165" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7f5884a35261cd799d7fad41165"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7f5884a35261cd799d7fad41165" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.CascadeMessage1749748827162 = CascadeMessage1749748827162;
