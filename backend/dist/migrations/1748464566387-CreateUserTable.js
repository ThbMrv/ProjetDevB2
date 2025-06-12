"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1680000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateUserTable1680000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
    async down(queryRunner) {
        await queryRunner.dropTable('user');
    }
}
exports.CreateUserTable1680000000000 = CreateUserTable1680000000000;
