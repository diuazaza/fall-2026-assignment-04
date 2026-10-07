import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Independent parent table: genres
  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .execute();

  // 2. Independent parent table: authors
  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('first_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(255)', (col) => col.notNull())
    .execute();

  // 3. Child table: borrowers (depends on existing users table; 1:1 optional cardinality with unique constraint)
  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade').notNull().unique()
    )
    .execute();

  // 4. Child table: books (depends on genres table)
  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('publication_year', 'integer', (col) => col.notNull())
    .addColumn('genre_id', 'integer', (col) =>
      col.references('genres.id').onDelete('cascade').notNull()
    )
    .execute();

  // 5. Junction table: book_authors (depends on books and authors tables)
  await db.schema
    .createTable('book_authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade').notNull()
    )
    .addColumn('author_id', 'integer', (col) =>
      col.references('authors.id').onDelete('cascade').notNull()
    )
    .execute();

  // 6. Child table: loans (depends on borrowers and books tables)
  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.references('borrowers.id').onDelete('cascade').notNull()
    )
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade').notNull()
    )
    .addColumn('loan_date', 'date', (col) => col.notNull())
    .addColumn('return_date', 'date')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop in reverse dependency order
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('book_authors').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('borrowers').execute();
  await db.schema.dropTable('authors').execute();
  await db.schema.dropTable('genres').execute();
}
