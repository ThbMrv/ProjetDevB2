"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoNom1749565895048 = void 0;
class AutoNom1749565895048 {
    constructor() {
        this.name = 'AutoNom1749565895048';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_user"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_pitchdeck"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "UQ_favorite_user_pitchdeck"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD "status" character varying NOT NULL DEFAULT 'en cours'`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD "pdfUrl" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "pdfUrl"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_favorite_user_pitchdeck" UNIQUE ("userId", "pitchdeckId")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_pitchdeck" FOREIGN KEY ("pitchdeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.AutoNom1749565895048 = AutoNom1749565895048;
