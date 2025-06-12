import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoNom1749675854934 implements MigrationInterface {
    name = 'AutoNom1749675854934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meeting" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD "pitchDeckId" integer`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_854982a74818bb6307419e0e6b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_af41fc76cdaab43d4202b340e9c"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "FK_854982a74818bb6307419e0e6b8"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN "pitchDeckId"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP COLUMN "userId"`);
    }

}
