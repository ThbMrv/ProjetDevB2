import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoNom1749566275101 implements MigrationInterface {
    name = 'AutoNom1749566275101'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "pdfUrl"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_favorite_user_pitchdeck" UNIQUE ("userId", "pitchdeckId")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_pitchdeck" FOREIGN KEY ("pitchdeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
