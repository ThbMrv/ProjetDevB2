"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMessageTable1748531621176 = void 0;
class AddMessageTable1748531621176 {
    constructor() {
        this.name = 'AddMessageTable1748531621176';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer, "receiverId" integer, "pitchDeckId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_71fb36906595c602056d936fc13" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7f5884a35261cd799d7fad41165" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7f5884a35261cd799d7fad41165"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_71fb36906595c602056d936fc13"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'creator'`);
        await queryRunner.query(`DROP TABLE "message"`);
    }
}
exports.AddMessageTable1748531621176 = AddMessageTable1748531621176;
