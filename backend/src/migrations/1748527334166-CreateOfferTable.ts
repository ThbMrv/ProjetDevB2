import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOfferTable1748527334166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'offer',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'user_id', type: 'int' },
          { name: 'pitch_deck_id', type: 'int' },
          { name: 'amount', type: 'float' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offer');
  }
}
