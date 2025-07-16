import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1752646012189 implements MigrationInterface {
    name = 'InitialSchema1752646012189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "title" character varying, "teamId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9017c2ee500cd1ba895752a0aa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "message" text NOT NULL, "response" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "sessionId" uuid NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "PK_cf76a7693b0b075dd86ea05f21d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("teamId" SERIAL NOT NULL, "userId" character varying NOT NULL, "teamName" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_798fa6ce240852169479d7bcb91" UNIQUE ("teamName"), CONSTRAINT "PK_d1abcbf186fd8b697c5609e4ddd" PRIMARY KEY ("teamId"))`);
        await queryRunner.query(`CREATE TABLE "team_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" integer NOT NULL, "userId" character varying NOT NULL, "isCreator" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_history" ADD CONSTRAINT "FK_4b6840230b4154e4a0e9f1b2a33" FOREIGN KEY ("sessionId") REFERENCES "chat_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_history" DROP CONSTRAINT "FK_4b6840230b4154e4a0e9f1b2a33"`);
        await queryRunner.query(`DROP TABLE "team_member"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "chat_history"`);
        await queryRunner.query(`DROP TABLE "chat_session"`);
    }

}
