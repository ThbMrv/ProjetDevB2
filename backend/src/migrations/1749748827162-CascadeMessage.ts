import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeMessage1749748827162 implements MigrationInterface {
    name = 'CascadeMessage1749748827162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7f5884a35261cd799d7fad41165"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7f5884a35261cd799d7fad41165" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7f5884a35261cd799d7fad41165"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7f5884a35261cd799d7fad41165" FOREIGN KEY ("pitchDeckId") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
