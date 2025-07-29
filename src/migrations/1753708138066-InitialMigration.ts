import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1753708138066 implements MigrationInterface {
    name = 'InitialMigration1753708138066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing table if it exists
        await queryRunner.query(`DROP TABLE IF EXISTS "document_embedding" CASCADE`);
        
        await queryRunner.query(`CREATE TABLE "teams" ("teamId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "teamName" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_798fa6ce240852169479d7bcb91" UNIQUE ("teamName"), CONSTRAINT "PK_d1abcbf186fd8b697c5609e4ddd" PRIMARY KEY ("teamId"))`);
        await queryRunner.query(`CREATE TABLE "folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "teamId" uuid NOT NULL, "parentId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "title" character varying, "teamId" character varying NOT NULL, "folderId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9017c2ee500cd1ba895752a0aa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "message" text NOT NULL, "response" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "sessionId" uuid NOT NULL, "teamId" character varying NOT NULL, CONSTRAINT "PK_cf76a7693b0b075dd86ea05f21d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" character varying NOT NULL, "userId" character varying NOT NULL, "isCreator" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "filepath" character varying NOT NULL, "mimetype" character varying NOT NULL, "teamId" character varying NOT NULL, "creatorId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_embedding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentId" character varying, "pageContent" text NOT NULL, "embedding" vector(1536) NOT NULL, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4bfbd48ecd2db28011e914c0b7" PRIMARY KEY ("id"))`);
       
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_6d215303916b6253090baaa5701" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_1be2fce400dcc657602d336f23f" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_history" ADD CONSTRAINT "FK_4b6840230b4154e4a0e9f1b2a33" FOREIGN KEY ("sessionId") REFERENCES "chat_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_history" DROP CONSTRAINT "FK_4b6840230b4154e4a0e9f1b2a33"`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP CONSTRAINT "FK_5d507508c0e0d3d072f89a3600d"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_1be2fce400dcc657602d336f23f"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_6d215303916b6253090baaa5701"`);

        await queryRunner.query(`DROP TABLE "upload"`);
        await queryRunner.query(`DROP TABLE "team_member"`);
        await queryRunner.query(`DROP TABLE "chat_history"`);
        await queryRunner.query(`DROP TABLE "chat_session"`);
        await queryRunner.query(`DROP TABLE "folders"`);
        await queryRunner.query(`DROP TABLE "teams"`);
    }

}
