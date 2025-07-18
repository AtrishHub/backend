import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFolderAndChatFolderRelation1752840268700 implements MigrationInterface {
    name = 'AddFolderAndChatFolderRelation1752840268700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "folders" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "teamId" integer NOT NULL, "parentId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD "folderId" integer`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_6d215303916b6253090baaa5701" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_1be2fce400dcc657602d336f23f" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_session" DROP CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_1be2fce400dcc657602d336f23f"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_6d215303916b6253090baaa5701"`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP COLUMN "folderId"`);
        await queryRunner.query(`DROP TABLE "folders"`);
    }

}
