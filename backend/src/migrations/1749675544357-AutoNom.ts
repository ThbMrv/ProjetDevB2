import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoNom1749675544357 implements MigrationInterface {
    name = 'AutoNom1749675544357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "fk_pitchdeck_accepted_offer"`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD "pitchDeckId" integer`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD CONSTRAINT "FK_386dbd5611ae135da286c2f60bc" FOREIGN KEY ("acceptedOfferId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_854982a74818bb6307419e0e6b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "FK_386dbd5611ae135da286c2f60bc"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN "pitchDeckId"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk_pitchdeck_accepted_offer" FOREIGN KEY ("acceptedOfferId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
