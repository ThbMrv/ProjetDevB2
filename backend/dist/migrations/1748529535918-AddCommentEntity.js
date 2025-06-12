"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCommentEntity1748529535918 = void 0;
class AddCommentEntity1748529535918 {
    constructor() {
        this.name = 'AddCommentEntity1748529535918';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "FK_94d5ca2eb1cb06ce28ef563edce"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`CREATE TABLE "comment" (
            "id" SERIAL NOT NULL,
            "content" character varying NOT NULL,
            "userId" integer,
            "pitchDeckId" integer,
            CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "pitch_deck_id"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "offer" ADD "pitchDeckId" integer`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        // ----- AJOUT ICI : Création du type ENUM
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM ('creator', 'investor')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'creator'`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_383c2de68244ebaa100b0b7b701" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD CONSTRAINT "FK_25e6627abc11d6ff9780f3dba45" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_e8100751be1076656606ae045e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7408b50271eb042af72cf8c4740" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7408b50271eb042af72cf8c4740"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_e8100751be1076656606ae045e3"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "FK_25e6627abc11d6ff9780f3dba45"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_383c2de68244ebaa100b0b7b701"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`); // Ajout pour rollback clean
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "pitchDeckId"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD "pitch_deck_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD CONSTRAINT "FK_94d5ca2eb1cb06ce28ef563edce" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.AddCommentEntity1748529535918 = AddCommentEntity1748529535918;
