---
name: PostgreSQL startup migrations
description: Avoiding deadlocks caused by unnecessary schema-changing migrations during concurrent application starts.
---

Schema changes that acquire exclusive PostgreSQL locks must be conditional on the current column definition instead of running unconditionally on every application start.

**Why:** Repeating an already-satisfied `ALTER TABLE ... TYPE` during overlapping starts can deadlock and prevent the web workflow from booting.

**How to apply:** Before a type-altering startup migration, inspect `information_schema.columns`; execute the migration only when the stored type differs from the required type.