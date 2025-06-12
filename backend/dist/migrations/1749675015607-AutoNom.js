"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoNom1749675015607 = void 0;
class AutoNom1749675015607 {
    constructor() {
        this.name = 'AutoNom1749675015607';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meeting" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD "pitchDeckId" integer`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_854982a74818bb6307419e0e6b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN "pitchDeckId"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN "userId"`);
    }
}
exports.AutoNom1749675015607 = AutoNom1749675015607;
