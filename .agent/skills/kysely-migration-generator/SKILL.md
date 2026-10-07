---
name: kysely-migration-generator
description: Consumes a Mermaid Entity-Relationship Diagram (ERD) schema and translates it into a type-safe, production-ready Kysely database migration script. Use this skill when asked to generate database migrations, translate schema.mmd to Kysely migrations, or update database schemas from an ERD.
---

# Kysely Migration Generator

## Purpose

Translate Mermaid Entity-Relationship Diagrams (`erDiagram`) into type-safe Kysely database migrations while respecting existing database tables, constraints, foreign key relationships, cascade behaviors, and dependency ordering.

## Workflow

1. **Inspect Existing Database & Migrations:**
   - Check `src/db/migrations/` to identify existing tables and column configurations.
   - Do **NOT** recreate tables that already exist (e.g., `users`).
2. **Parse Mermaid ERD:**
   - Read `docs/architecture/schema.mmd`.
   - Identify entities, attributes, data types, primary keys (`PK`), foreign keys (`FK`), unique keys (`UK`), and relationship cardinalities (`||--o{`, `||--o|`, etc.).
3. **Map Schema to Kysely DDL:**
   - **Entities to Tables:** Map Mermaid entity names to `snake_case` table names (e.g., `USERS` -> `users`).
   - **Primary Keys:** Convert `PK` attributes to auto-generating serial/UUID identifiers (e.g., `.addColumn('id', 'serial', (col) => col.primaryKey())`).
   - **Data Types:** Map Mermaid data types to SQL types:
     - `integer` -> `'integer'` (or `'serial'` for primary keys)
     - `varchar(255)` -> `'varchar(255)'`
     - `timestamp` -> `'timestamp'`
     - `date` -> `'date'`
   - **Foreign Keys:** Convert `FK` attributes to referenced foreign keys with cascade delete:
     - `.references('<target_table>.id').onDelete('cascade')`
   - **Cardinality Mapping:**
     - `||--o{` (one-to-many): Standard foreign key column referencing the parent table.
     - `||--o|` (one-to-zero-or-one / one-to-one): Add `.unique()` constraint to the foreign key column to ensure uniqueness.
4. **Dependency Resolution:**
   - In `up()`: Create tables in dependency order (parent/referenced tables created before child/dependent tables).
   - In `down()`: Drop tables in exact reverse dependency order.
5. **Output File:**
   - Write migration to `src/db/migrations/<timestamp>_<migration_name>.ts` (e.g., `src/db/migrations/1728259200000_library_system.ts` or `Date.now()`).
   - Export both `export async function up(db: Kysely<any>): Promise<void>` and `export async function down(db: Kysely<any>): Promise<void>`.
6. **Verification:**
   - Run `npm run build` to ensure type-safety.
   - Run `npm run migrate:up` to verify database execution.
