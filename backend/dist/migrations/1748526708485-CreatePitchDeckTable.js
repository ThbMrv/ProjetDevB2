"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePitchDeckTable1680000000020 = void 0;
const typeorm_1 = require("typeorm");
class CreatePitchDeckTable1680000000020 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
    async down(queryRunner) {
        await queryRunner.dropTable('pitch_deck');
    }
}
exports.CreatePitchDeckTable1680000000020 = CreatePitchDeckTable1680000000020;
