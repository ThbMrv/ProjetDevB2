import { MigrationInterface, QueryRunner } from "typeorm";

export class updateFavoriteManual1749374283983 implements MigrationInterface {
  name = 'updateFavoriteManual1749374283983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les anciennes colonnes si elles existent
    await queryRunner.query(`DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='favorite' AND column_name='isRead'
        ) THEN
          ALTER TABLE "favorite" DROP COLUMN "isRead";
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='favorite' AND column_name='senderId'
        ) THEN
          ALTER TABLE "favorite" DROP COLUMN "senderId";
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='favorite' AND column_name='recipientId'
        ) THEN
          ALTER TABLE "favorite" DROP COLUMN "recipientId";
        END IF;
      END
    $$;`);

    // Ajouter les nouvelles colonnes si elles n'existent pas déjà
    await queryRunner.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='favorite' AND column_name='userId'
        ) THEN
          ALTER TABLE "favorite" ADD "userId" integer;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='favorite' AND column_name='pitchdeckId'
        ) THEN
          ALTER TABLE "favorite" ADD "pitchdeckId" integer;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='favorite' AND column_name='createdAt'
        ) THEN
          ALTER TABLE "favorite" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now();
        END IF;
      END
    $$;`);

    // Ajouter les contraintes si elles n'existent pas
    await queryRunner.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'favorite' AND constraint_name = 'UQ_favorite_user_pitchdeck'
        ) THEN
          ALTER TABLE "favorite"
          ADD CONSTRAINT "UQ_favorite_user_pitchdeck"
          UNIQUE ("userId", "pitchdeckId");
        END IF;
      END
    $$;`);

    await queryRunner.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'favorite' AND constraint_name = 'FK_favorite_user'
        ) THEN
          ALTER TABLE "favorite"
          ADD CONSTRAINT "FK_favorite_user"
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'favorite' AND constraint_name = 'FK_favorite_pitchdeck'
        ) THEN
          ALTER TABLE "favorite"
          ADD CONSTRAINT "FK_favorite_pitchdeck"
          FOREIGN KEY ("pitchdeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE;
        END IF;
      END
    $$;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les nouvelles contraintes
    await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT IF EXISTS "FK_favorite_pitchdeck"`);
    await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT IF EXISTS "FK_favorite_user"`);
    await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT IF EXISTS "UQ_favorite_user_pitchdeck"`);

    // Supprimer les colonnes ajoutées
    await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN IF EXISTS "createdAt"`);
    await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN IF EXISTS "pitchdeckId"`);
    await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN IF EXISTS "userId"`);

    // Remettre les anciennes colonnes
    await queryRunner.query(`ALTER TABLE "favorite" ADD COLUMN IF NOT EXISTS "recipientId" integer`);
    await queryRunner.query(`ALTER TABLE "favorite" ADD COLUMN IF NOT EXISTS "senderId" integer`);
    await queryRunner.query(`ALTER TABLE "favorite" ADD COLUMN IF NOT EXISTS "isRead" boolean NOT NULL DEFAULT false`);
  }
}
