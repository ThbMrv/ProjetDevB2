import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'user',
      columns: [
        { name: 'id', type: 'serial', isPrimary: true },
        { name: 'email', type: 'varchar', isUnique: true },
        { name: 'password', type: 'varchar' },
        { name: 'name', type: 'varchar' },
        { name: 'role', type: 'varchar' },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
