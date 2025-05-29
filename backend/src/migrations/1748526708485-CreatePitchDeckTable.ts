import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePitchDeckTable1680000000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'pitch_deck',
      columns: [
        { name: 'id', type: 'serial', isPrimary: true },
        { name: 'user_id', type: 'int' },
        { name: 'file', type: 'varchar' },
        { name: 'amount', type: 'float' },
      ],
      foreignKeys: [
        {
          columnNames: ['user_id'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pitch_deck');
  }
}
