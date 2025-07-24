import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFolderAndChatsessionIds1753356160751 implements MigrationInterface {
    name = 'UpdateFolderAndChatsessionIds1753356160751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_embedding" RENAME COLUMN "text" TO "pageContent"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_1be2fce400dcc657602d336f23f"`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "parentId" uuid`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP COLUMN "folderId"`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD "folderId" uuid`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_1be2fce400dcc657602d336f23f" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_session" DROP CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_1be2fce400dcc657602d336f23f"`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP COLUMN "folderId"`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD "folderId" integer`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "parentId" integer`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_1be2fce400dcc657602d336f23f" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_embedding" RENAME COLUMN "pageContent" TO "text"`);
    }

}
