
## Database Setup & Migrations

This project uses TypeORM migrations for database schema management. This ensures all users and environments have a consistent schema.

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your database
Set your database connection settings in environment variables or edit them in `src/data-source.ts` and `src/app.module.ts`.

### 3. Run migrations (for a new or empty database)
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts
```
This will create all tables and schema in your database.

### 4. Generating new migrations (after changing entities)
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migrations/YourMigrationName -d src/data-source.ts
```
Commit the generated migration file to git so others can use it.

### 5. Best Practice
- Set `synchronize: false` in both `src/app.module.ts` and `src/data-source.ts` to avoid accidental schema changes.
- Always use migrations for schema changes in team/production environments.

### 6. Troubleshooting
- If you get errors about missing tables/columns, make sure you have run all migrations.
- If you get errors about missing entity files, check your import paths in `src/data-source.ts` (use only relative imports).

