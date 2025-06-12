"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationTable1748533420787 = void 0;
class CreateNotificationTable1748533420787 {
    constructor() {
        this.name = 'CreateNotificationTable1748533420787';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }
}
exports.CreateNotificationTable1748533420787 = CreateNotificationTable1748533420787;
