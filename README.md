
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


When we add another coloumn in the existing entity or table we have to run this command----

npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migrations/Add[YourNewColumnName]To[YourTableName] -d src/data-source.ts

Example-- like we add new coloumn name:IsPersonal in the table Name: Teams then for this command is:--

npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migrations/AddIsPersonalToTeams -d src/data-source.ts

This command update the migrations files in the code---

Now we have to apply these Migrations in database for which we have to run command:---

npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts


----if we have to add new table-----

like we have to add new table name:Teams the we have to do following things: 

firstly update the data-source.ts file-- add teams entity in the file. 
 
after that run command--

npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migrations/add-[entity name]-entity -d src/data-source.ts 

example--

npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migrations/add-Teams-entity -d src/data-source.ts 

after that apply migrations by running command--- 

npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts





