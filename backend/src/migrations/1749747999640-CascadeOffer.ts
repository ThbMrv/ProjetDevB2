import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOffer1749747999640 implements MigrationInterface {
    name = 'CascadeOffer1749747999640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7408b50271eb042af72cf8c4740"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7408b50271eb042af72cf8c4740" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7408b50271eb042af72cf8c4740"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7408b50271eb042af72cf8c4740" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
