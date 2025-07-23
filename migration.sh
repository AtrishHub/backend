#!/bin/bash

# A script to manage TypeORM migrations in a NestJS project.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The path where new migrations will be generated.
# Make sure this path matches the 'migrations' path in your TypeORM data source.
MIGRATION_PATH="src/db/migrations"


# --- Functions ---

# Displays how to use the script.
usage() {
  echo "Usage: $0 {generate|run|revert} [name]"
  echo ""
  echo "Commands:"
  echo "  generate <MigrationName>   Generates a new migration file with the given name."
  echo "  run                        Runs all pending migrations."
  echo "  revert                     Reverts the last executed migration."
  echo ""
  exit 1
}


# --- Main Logic ---

# The command to execute (generate, run, or revert).
COMMAND=$1
# The name for the migration (only used for 'generate').
MIGRATION_NAME=$2

# Check if a command was provided.
if [ -z "$COMMAND" ]; then
  echo "Error: No command specified."
  usage
fi

# Use a case statement to handle the different commands.
case "$COMMAND" in
  generate)
    # Check if a migration name was provided for the generate command.
    if [ -z "$MIGRATION_NAME" ]; then
      echo "Error: A migration name is required for the 'generate' command."
      usage
    fi
    echo "✅ Generating migration: $MIGRATION_NAME"
    npm run typeorm -- migration:generate "$MIGRATION_PATH/$MIGRATION_NAME"
    ;;

  run)
    echo "🚀 Running pending migrations..."
    npm run typeorm -- migration:run
    ;;

  revert)
    echo "⏪ Reverting last migration..."
    npm run typeorm -- migration:revert
    ;;

  *)
    echo "Error: Invalid command '$COMMAND'"
    usage
    ;;
esac

echo "✅ Done."