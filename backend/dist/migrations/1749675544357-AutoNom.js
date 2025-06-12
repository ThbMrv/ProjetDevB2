"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoNom1749675544357 = void 0;
class AutoNom1749675544357 {
    constructor() {
        this.name = 'AutoNom1749675544357';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT IF EXISTS "fk_pitchdeck_accepted_offer"`);
        // Ajout colonne userId
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
        // Ajout colonne pitchDeckId
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
        // Ajout contrainte pitch_deck.acceptedOfferId → offer.id
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_386dbd5611ae135da286c2f60bc'
                ) THEN
                    ALTER TABLE "pitch_deck" ADD CONSTRAINT "FK_386dbd5611ae135da286c2f60bc" 
                    FOREIGN KEY ("acceptedOfferId") REFERENCES "offer"("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);
        // Ajout contrainte meeting.userId → user.id
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
        // Ajout contrainte meeting.pitchDeckId → pitch_deck.id
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
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT IF EXISTS "FK_af41fc76cdaab43d4202b340e9c"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT IF EXISTS "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT IF EXISTS "FK_386dbd5611ae135da286c2f60bc"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN IF EXISTS "pitchDeckId"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN IF EXISTS "userId"`);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'fk_pitchdeck_accepted_offer'
                ) THEN
                    ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk_pitchdeck_accepted_offer" 
                    FOREIGN KEY ("acceptedOfferId") REFERENCES "offer"("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);
    }
}
exports.AutoNom1749675544357 = AutoNom1749675544357;
