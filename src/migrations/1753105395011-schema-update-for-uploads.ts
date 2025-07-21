import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdateForUploads1753105395011 implements MigrationInterface {
    name = 'SchemaUpdateForUploads1753105395011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "filepath" character varying NOT NULL, "mimetype" character varying NOT NULL, "teamId" character varying NOT NULL, "creatorId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "upload"`);
    }

}
