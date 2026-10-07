---
name: erd-generator
description: Generate and validate Mermaid Entity-Relationship Diagrams from unstructured domain requirements. Use this skill when the user asks to design an ERD, database schema, data model, or architecture diagram involving entities, relationships, primary keys, foreign keys, or cardinalities.
---

# ERD Generator

## Purpose

Convert unstructured domain requirements into a verified Mermaid Entity-Relationship Diagram.

## Workflow

1. Read and understand the user's domain requirements.
2. Identify:
   - Entities
   - Attributes
   - Primary keys (PK)
   - Foreign keys (FK)
   - Relationships
   - Cardinalities
3. Consider existing database tables mentioned by the user. Do not recreate tables that already exist.
4. Create the directory `docs/architecture/` if it does not exist.
5. Write the Mermaid ERD directly to:

   `docs/architecture/schema.mmd`

6. The Mermaid file must use valid Mermaid `erDiagram` syntax.
7. Execute:

   `node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd`

8. If the renderer succeeds, verify that:

   `docs/architecture/erd.svg`

   exists.

9. If the renderer fails with `SYNTAX_ERROR`, inspect the error message, correct the Mermaid syntax in `docs/architecture/schema.mmd`, and run the renderer again.

10. Retry the correction process no more than 3 times.

11. Do not consider the task complete until the Mermaid file successfully compiles into the SVG, unless the user explicitly asks to stop.

## Mermaid Requirements

Use Mermaid `erDiagram` syntax.

Represent primary keys with `PK`.

Represent foreign keys with `FK`.

Use explicit data types for attributes.

Use Mermaid relationship notation to represent cardinality.

Examples:

- `||--o{` represents one-to-many.
- `||--o|` represents one-to-zero-or-one / one-to-one optional relationships.

## Output

When the task succeeds:

1. Ensure `docs/architecture/schema.mmd` contains the final Mermaid ERD.
2. Ensure `docs/architecture/erd.svg` has been generated.
3. Present the raw Mermaid ERD to the user.
4. Reference the generated SVG at:

   `docs/architecture/erd.svg`