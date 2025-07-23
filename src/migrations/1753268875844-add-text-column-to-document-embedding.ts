import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTextColumnToDocumentEmbedding1753268875844 implements MigrationInterface {
    name = 'AddTextColumnToDocumentEmbedding1753268875844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_embedding" ADD "text" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_embedding" DROP COLUMN "text"`);
    }

}
