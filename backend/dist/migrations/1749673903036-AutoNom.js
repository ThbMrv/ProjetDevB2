"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoNom1749673903036 = void 0;
class AutoNom1749673903036 {
    constructor() {
        this.name = 'AutoNom1749673903036';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('creator', 'investor', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('creator', 'investor')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
    }
}
exports.AutoNom1749673903036 = AutoNom1749673903036;
