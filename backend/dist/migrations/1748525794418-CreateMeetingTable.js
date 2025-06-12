"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMeetingTable1680000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateMeetingTable1680000000001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'meeting',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                },
                {
                    name: 'meeting_date',
                    type: 'timestamp',
                    isNullable: false,
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('meeting');
    }
}
exports.CreateMeetingTable1680000000001 = CreateMeetingTable1680000000001;
