import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDocumentEmbeddingEntity1753257111546 implements MigrationInterface {
    name = 'AddDocumentEmbeddingEntity1753257111546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document_embedding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentId" character varying NOT NULL, "pageContent" text NOT NULL, "embedding"  float8[] NOT NULL, "metadata" jsonb NOT NULL, CONSTRAINT "PK_f4bfbd48ecd2db28011e914c0b7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "document_embedding"`);
    }

}
