"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoNom1749568666211 = void 0;
class AutoNom1749568666211 {
    constructor() {
        this.name = 'AutoNom1749568666211';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'FK_favorite_user'
                ) THEN
                    ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_user";
                END IF;

                IF EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'FK_favorite_pitchdeck'
                ) THEN
                    ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_pitchdeck";
                END IF;

                IF EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'UQ_favorite_user_pitchdeck'
                ) THEN
                    ALTER TABLE "favorite" DROP CONSTRAINT "UQ_favorite_user_pitchdeck";
                END IF;
            END$$;
        `);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_1fcef9c16163da38f4d950047dd" UNIQUE ("userId", "pitchdeckId")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_4d7498b4127a86843e6ecf4a7ac" FOREIGN KEY ("pitchdeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_4d7498b4127a86843e6ecf4a7ac"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "UQ_1fcef9c16163da38f4d950047dd"`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_favorite_user_pitchdeck" UNIQUE ("userId", "pitchdeckId")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_pitchdeck" FOREIGN KEY ("pitchdeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.AutoNom1749568666211 = AutoNom1749568666211;
