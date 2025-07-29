import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentEmbeddingDocumentIdIndex1753708138067 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Make sure the column is present and nullable
        await queryRunner.query(`
            ALTER TABLE "document_embedding"
            ALTER COLUMN "documentId" DROP NOT NULL
        `);

        // Add an index for fast lookup
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_document_embedding_documentId"
            ON "document_embedding" ("documentId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_document_embedding_documentId"
        `);
    }
} 