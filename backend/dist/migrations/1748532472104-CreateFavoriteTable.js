"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFavoriteTable1748532472104 = void 0;
class CreateFavoriteTable1748532472104 {
    constructor() {
        this.name = 'CreateFavoriteTable1748532472104';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "favorite" ("id" SERIAL NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "senderId" integer, "recipientId" integer, CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_36e3d7c68d3079b49b99e131697" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_7981d34a2782d98e53ac7f84129" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_7981d34a2782d98e53ac7f84129"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_36e3d7c68d3079b49b99e131697"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
    }
}
exports.CreateFavoriteTable1748532472104 = CreateFavoriteTable1748532472104;
