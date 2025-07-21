import { MigrationInterface, QueryRunner } from "typeorm";

export class UuidTeamidMigration1753095461083 implements MigrationInterface {
    name = 'UuidTeamidMigration1753095461083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_6d215303916b6253090baaa5701"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "PK_d1abcbf186fd8b697c5609e4ddd"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "teamId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "PK_d1abcbf186fd8b697c5609e4ddd" PRIMARY KEY ("teamId")`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "teamId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD "teamId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_history" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "chat_history" ADD "teamId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "teamId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_6d215303916b6253090baaa5701" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_6d215303916b6253090baaa5701"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD "teamId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_history" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "chat_history" ADD "teamId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD "teamId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "teamId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "PK_d1abcbf186fd8b697c5609e4ddd"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "teamId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "PK_d1abcbf186fd8b697c5609e4ddd" PRIMARY KEY ("teamId")`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_6d215303916b6253090baaa5701" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
