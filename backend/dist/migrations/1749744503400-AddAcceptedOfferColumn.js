"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAcceptedOfferColumn1749744503400 = void 0;
class AddAcceptedOfferColumn1749744503400 {
    constructor() {
        this.name = 'AddAcceptedOfferColumn1749744503400';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD "acceptedOfferId" integer`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD CONSTRAINT "FK_386dbd5611ae135da286c2f60bc" FOREIGN KEY ("acceptedOfferId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_854982a74818bb6307419e0e6b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "FK_386dbd5611ae135da286c2f60bc"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "acceptedOfferId"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_854982a74818bb6307419e0e6b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.AddAcceptedOfferColumn1749744503400 = AddAcceptedOfferColumn1749744503400;
