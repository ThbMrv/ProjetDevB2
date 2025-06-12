import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoNom1749675854934 implements MigrationInterface {
    name = 'AutoNom1749675854934';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ajout colonne userId si elle n'existe pas
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'meeting' AND column_name = 'userId'
                ) THEN
                    ALTER TABLE "meeting" ADD "userId" integer;
                END IF;
            END
            $$;
        `);

        // Ajout colonne pitchDeckId si elle n'existe pas
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'meeting' AND column_name = 'pitchDeckId'
                ) THEN
                    ALTER TABLE "meeting" ADD "pitchDeckId" integer;
                END IF;
            END
            $$;
        `);

        // Ajout contrainte FK sur userId si elle n'existe pas
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_854982a74818bb6307419e0e6b8'
                ) THEN
                    ALTER TABLE "meeting" ADD CONSTRAINT "FK_854982a74818bb6307419e0e6b8"
                    FOREIGN KEY ("userId") REFERENCES "user"("id")
                    ON DELETE CASCADE ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);

        // Ajout contrainte FK sur pitchDeckId si elle n'existe pas
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_af41fc76cdaab43d4202b340e9c'
                ) THEN
                    ALTER TABLE "meeting" ADD CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c"
                    FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id")
                    ON DELETE CASCADE ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT IF EXISTS "FK_af41fc76cdaab43d4202b340e9c"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT IF EXISTS "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN IF EXISTS "pitchDeckId"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN IF EXISTS "userId"`);
    }
}
